const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticateUser = require('../middleware/authenticateUser');
const connection = require('../config/db'); // Make sure you have the appropriate DB configuration

const SECRET_KEY = 'your_secret_key';

const router = express.Router();

// Create user
router.post('/api/users', async (req, res) => {
    try {
        const { username, password, email } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const insertUserQuery = "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";

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
    const { email, password } = req.body;

    // Retrieve user details based on the provided email
    const getUserQuery = `
        SELECT * FROM users
        WHERE email = ?
    `;

    connection.query(getUserQuery, [email], async (err, userResult) => {
        if (err) {
            console.error('Error retrieving user:', err);
            return res.status(500).json({ error: 'An error occurred while retrieving user' });
        }

        try {
            if (userResult.length === 0) {
                throw new Error('User not found');
            }

            const user = userResult[0];

            // Compare the provided password with the hashed password in the database
            const isPasswordMatch = await bcrypt.compare(password, user.password);

            if (!isPasswordMatch) {
                throw new Error('Incorrect password');
            }

            // At this point, user is authenticated
            // You can generate a JWT token and send it back as a response
            // For now, let's just send a success message
            return res.status(200).json({ message: 'Authentication successful' });
        } catch (error) {
            console.error('Authentication error:', error.message);
            return res.status(401).json({ error: error.message });
        }
    });
});
// accessResoure Token
router.get('/accessResoure', authenticateUser, (req, res) => {
    try {
        const decodedToken = jwt.verify(req.headers.authorization.split(' ')[1], SECRET_KEY);
        res.status(200).json({ success: true, data: { userId: decodedToken.userId, email: decodedToken.email,
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
        const fetchUserQuery = 'SELECT * FROM users WHERE userID = ?';
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
            const updateUserQuery = 'UPDATE users SET username = ?, email = ?, password = ? WHERE userID = ?';
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
        const fetchUserQuery = 'SELECT * FROM users WHERE userID = ?';
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
            const deleteUserQuery = 'DELETE FROM users WHERE userID = ?';
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