const express = require('express');
const authenticateUser = require('../middleware/authenticateUser');
const connection = require('../config/db');
const router = express.Router();


router.post('/api/users/category/:categoryName', authenticateUser, async (req, res) => {
    try {
        const categoryName = req.params.categoryName; // Corrected this line
        const userID = req.userId;
        console.log(userID);

        // Insert new category into the database
        const insertCategoryQuery = "INSERT INTO categories (categoryName, userID) VALUES (?, ?)";
        connection.query(insertCategoryQuery, [categoryName, userID], (error, results) => {
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

router.put('/api/users/category/:categoryName/:newData', authenticateUser, async (req, res) => {
    try {
        const { categoryName, newData } = req.params;
        const userID = req.userId;

        // Fetch the user's information from the database
        const fetchUserQuery = 'SELECT * FROM users WHERE userID = ?';
        connection.query(fetchUserQuery, [userID], async (error, userResults) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal server error' });
            }

            if (userResults.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Update category information in the database
            const updateCategoryQuery = 'UPDATE categories SET categoryName = ? WHERE categoryName = ?';
            connection.query(updateCategoryQuery, [newData, categoryName], (error, updateResults) => {
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

router.delete('/api/users/category/:categoryName', authenticateUser, async (req, res) => {
    try {
        const { categoryName } = req.params;
        const userID = req.userId;

        // Fetch the user's information from the database
        const fetchUserQuery = 'SELECT * FROM users WHERE userID = ?';
        connection.query(fetchUserQuery, [userID], async (error, userResults) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal server error' });
            }

            if (userResults.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Delete category from the database
            const deleteCategoryQuery = 'DELETE FROM categories WHERE categoryName = ?';
            connection.query(deleteCategoryQuery, [categoryName], (error, deleteResults) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ message: 'Internal server error' });
                }

                res.status(200).json({ message: 'Category deleted successfully' });
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



module.exports = router;