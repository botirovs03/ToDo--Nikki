const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticateUser = require('../middleware/authenticateUser');
const connection = require('../config/db');

const SECRET_KEY = 'your_secret_key';

const router = express.Router();

router.post('/api/users', async (req, res) => {
    try {
        const { username, password, email } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const inserUserQuery = "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";

        connection.query(
            inserUserQuery, [username, hashedPassword, email], (err, result) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: 'Failed to register user' });
                } else {
                    res.status(201).json({ message: 'User registered successfully' });
                }
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}); // Add User


router.post('/api/auth', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user in the database
        connection.query('SELECT * FROM users WHERE username = ?', [username], async (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal server error' });
            };

            if (results.length === 0) {
                return res.status.json({ message: 'Invalid credentials' });
            };

            const user = results[0];


            // Compare the provided password with the hashed password
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                res.status(401).json({ message: 'Password is invalid' });
            }
            const token = jwt.sign({ userId: user.user_id }, SECRET_KEY, {
                expiresIn: '1h'
            });

            res.status(200).json({token});
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}); // Check user from sql


router.get('/accessResoure', authenticateUser, (req, res) => {
    try {
        
        const decodedToken = jwt.verify(req.headers.authorization.split(' ')[1], SECRET_KEY);
        res.status(200).json({ success: true, data: { userId: decodedToken.userId, email: decodedToken.email } });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

router.put('/api/users/:user_id', authenticateUser, async (req, res) => {
    const userIdToUpdate = req.params.user_id;
    const { username, password } = req.body;

    try {
        // Fetch the user's information from the database
        const fetchUserQuery = 'SELECT * FROM users WHERE user_id = ?';
        connection.query(fetchUserQuery, [userIdToUpdate], async (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal server error' });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            const user = results[0];

            // Check if the authenticated user is the same as the user being updated
            if (req.userId !== user.user_id) {
                return res.status(403).json({ message: 'You do not have permission to update this user.' });
            }

            // Hash the new password if provided
            const updatedPassword = password ? await bcrypt.hash(password, 10) : user.password;

            // Update user information in the database
            const updateUserQuery = 'UPDATE users SET username = ?, password = ? WHERE user_id = ?';
            connection.query(updateUserQuery, [username, updatedPassword, userIdToUpdate], (error, results) => {
                if (error) {
                    console.error('Error updating user:', error);
                    return res.status(500).json({ message: 'Internal server error' });
                }
                
                res.status(200).json({ message: 'User updated successfully' });
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/api/users/:user_id', authenticateUser, async (req, res) => {
    const userIdToDelete = req.params.user_id;

    try {
        // Fetch the user's information from the database
        const fetchUserQuery = 'SELECT * FROM users WHERE user_id = ?';
        connection.query(fetchUserQuery, [userIdToDelete], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal server error' });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            const user = results[0];

            // Check if the authenticated user is authorized to delete this user
            if (req.userId !== user.user_id) {
                return res.status(403).json({ message: 'Not authorized to delete this user' });
            }

            // Proceed with user deletion
            const deleteUserQuery = 'DELETE FROM users WHERE user_id = ?';
            connection.query(deleteUserQuery, [userIdToDelete], (error, results) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ message: 'Internal server error' });
                }

                res.status(200).json({ message: 'User deleted successfully' });
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.post('/api/users/category/:category_name', authenticateUser, async (req, res) => {
    try {
        const category_name = req.params.category_name; // Corrected this line
        const user_id = req.userId;

        // Insert new category into the database
        const insertCategoryQuery = "INSERT INTO categories (category_name, user_id) VALUES (?, ?)";
        connection.query(insertCategoryQuery, [category_name, user_id], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal server error' });
            }

            res.status(201).json({ message: 'Category created successfully' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



router.put('/api/users/category/:category_id/:newData', authenticateUser, async (req, res) => {
    try {
        const { category_id, newData } = req.params; // Corrected this line
        const user_id = req.userId;

        // Fetch the user's information from the database
        const fetchUserQuery = 'SELECT * FROM users WHERE user_id = ?';
        connection.query(fetchUserQuery, [user_id], async (error, userResults) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal server error' });
            }

            if (userResults.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Update category information in the database
            const updateCategoryQuery = 'UPDATE categories SET category_name = ? WHERE category_id = ?'; // Corrected this line
            connection.query(updateCategoryQuery, [newData, category_id], (error, updateResults) => { // Corrected this line
                if (error) {
                    console.error(error);
                    return res.status(500).json({ message: 'Internal server error' });
                }

                res.status(200).json({ message: 'Category updated successfully' });
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});





module.exports = router;
