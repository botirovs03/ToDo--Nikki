const express = require('express');
const authenticateUser = require('../middleware/authenticateUser');
const connection = require('../config/db');
const router = express.Router();



router.post('/api/categories', authenticateUser, async (req, res) => {
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

router.put('/api/categories/:categoryID', authenticateUser, async (req, res) => {
    const userID = req.userId; // Get the authenticated user's ID
    const categoryID = req.params.categoryID;
    const { categoryName } = req.body;

    // Validate input data
    if (!categoryName) {
        return res.status(400).json({ error: 'Category name is required' });
    }

    try {
        // Check if the category exists for the user
        const checkCategoryQuery = `
            SELECT * FROM categories
            WHERE categoryID = ? AND userID = ?
        `;
        const categoryCheckResult = await connection.promise().query(checkCategoryQuery, [categoryID, userID]);

        if (categoryCheckResult[0].length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Update the category name in the database
        const updateCategoryQuery = `
            UPDATE categories
            SET categoryName = ?
            WHERE categoryID = ?
        `;
        await connection.promise().query(updateCategoryQuery, [categoryName, categoryID]);

        return res.status(200).json({ message: 'Category updated successfully' });
    } catch (error) {
        console.error('Error updating category:', error);
        return res.status(500).json({ error: 'An error occurred while updating the category' });
    }
});

router.delete('/api/categories/:categoryID', authenticateUser, async (req, res) => {
    const userID = req.userId; // Get the authenticated user's ID
    const categoryID = req.params.categoryID;

    try {
        // Check if the category exists for the user
        const checkCategoryQuery = `
            SELECT * FROM categories
            WHERE categoryID = ? AND userID = ?
        `;
        const categoryCheckResult = await connection.promise().query(checkCategoryQuery, [categoryID, userID]);

        if (categoryCheckResult[0].length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Delete the category from the database
        const deleteCategoryQuery = `
            DELETE FROM categories
            WHERE categoryID = ?
        `;
        await connection.promise().query(deleteCategoryQuery, [categoryID]);

        return res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        return res.status(500).json({ error: 'An error occurred while deleting the category' });
    }
});

module.exports = router;