const express = require('express');
const authenticateUser = require('../middleware/authenticateUser');
const connection = require('../config/db');
const router = express.Router();



router.post('/api/users/category', authenticateUser, async (req, res) => {
    const userID = req.userId; // Get the authenticated user's ID
    const { categoryName } = req.body;

    // Validate input data
    if (!categoryName) {
        return res.status(400).json({ error: 'Category name is required' });
    }

    try {
        // Check if the category already exists for the user
        const checkCategoryQuery = `
            SELECT * FROM categories
            WHERE userID = ? AND categoryName = ?
        `;
        const categoryCheckResult = await connection.promise().query(checkCategoryQuery, [userID, categoryName]);

        if (categoryCheckResult[0].length > 0) {
            return res.status(400).json({ error: 'Category already exists for the user' });
        }

        // Insert the new category into the database
        const insertCategoryQuery = `
            INSERT INTO categories (userID, categoryName)
            VALUES (?, ?)
        `;
        const insertResult = await connection.promise().query(insertCategoryQuery, [userID, categoryName]);

        const insertedCategoryID = insertResult[0].insertId;
        return res.status(201).json({ message: 'Category created successfully', categoryID: insertedCategoryID });
    } catch (error) {
        console.error('Error creating category:', error);
        return res.status(500).json({ error: 'An error occurred while creating the category' });
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