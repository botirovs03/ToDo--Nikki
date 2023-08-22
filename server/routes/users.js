const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticateUser = require('../middleware/authenticateUser');
const connection = require('../config/db'); // Make sure you have the appropriate DB configuration
const { use } = require('passport');

const SECRET_KEY = 'your_secret_key';

const router = express.Router();

// Create user
router.post('/api/users', async (req, res) => {
    try {
        const { username, password, email } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const insertUserQuery = "INSERT INTO users (Username, Password, Email) VALUES (?, ?, ?)";

        connection.query(
            insertUserQuery, [username, hashedPassword, email], (err, result) => {
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
});

// Login user
router.post('/api/auth', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user in the database
        connection.query('SELECT * FROM users WHERE Email = ?', [email], async (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal server error' });
            }

            if (results.length === 0) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const user = results[0];
            console.log(user)
            const passwordMatch = await bcrypt.compare(password, user.Password);

            if (!passwordMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ UserId: user.UserID }, SECRET_KEY, {
                expiresIn: '1h'
            });
            res.status(200).json({ token });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// accessResoure Token
router.get('/accessResoure', authenticateUser, (req, res) => {
    try {
        const decodedToken = jwt.verify(req.headers.authorization.split(' ')[1], SECRET_KEY);
        res.status(200).json({ success: true, data: { UserId: decodedToken.UserId, email: decodedToken.email,
        username: decodedToken.username } });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

// update User
router.put('/api/users/:userID', authenticateUser, async (req, res) => {
    const userIdToUpdate = req.params.userID;
    const { username, password, email } = req.body;

    try {
        // Fetch the user's information from the database
        const fetchUserQuery = 'SELECT * FROM users WHERE UserID = ?';
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
            if (req.userId !== user.userID) {
                return res.status(403).json({ message: 'You do not have permission to update this user.' });
            }

            // Hash the new password if provided
            const updatedPassword = password ? await bcrypt.hash(password, 10) : user.password;

            // Update user information in the database
            const updateUserQuery = 'UPDATE Users SET Username = ?, Email = ?, Password = ? WHERE UserID = ?';
            connection.query(updateUserQuery, [username, email, updatedPassword, userIdToUpdate], (error, results) => {
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

// delete User
router.delete('/api/users/:userID', authenticateUser, async (req, res) => {
    const userIdToDelete = req.params.userID;

    try {
        // Fetch the user's information from the database
        const fetchUserQuery = 'SELECT * FROM users WHERE UserID = ?';
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
            if (req.userId !== user.userID) {
                return res.status(403).json({ message: 'Not authorized to delete this user' });
            }

            // Proceed with user deletion
            const deleteUserQuery = 'DELETE FROM Users WHERE UserID = ?';
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

module.exports = router;