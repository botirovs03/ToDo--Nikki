const express = require("express");
const authenticateUser = require("../middleware/authenticateUser");
const { pool } = require("../config/db");
const router = express.Router();

router.post("/api/categories", authenticateUser, (req, res) => {
  const userID = req.userId; // Get the authenticated user's ID
  const { categoryName } = req.body;

  // Validate input data
  if (!categoryName) {
    return res.status(400).json({ error: "Category name is required" });
  }

  pool.getConnection((getConnectionError, connection) => {
    if (getConnectionError) {
      console.error(getConnectionError);
      return res.status(500).json({ error: "Internal server error" });
    }

    // Check if the category already exists for the user
    const checkCategoryQuery = `
            SELECT * FROM categories
            WHERE UserID = ? AND CategoryName = ?
        `;

    connection.query(
      checkCategoryQuery,
      [userID, categoryName],
      (categoryErr, categoryCheckResult) => {
        if (categoryErr) {
          console.error(categoryErr);
          connection.release();
          return res
            .status(500)
            .json({ error: "An error occurred while checking the category" });
        }

        if (categoryCheckResult.length > 0) {
          connection.release();
          return res
            .status(400)
            .json({ error: "Category already exists for the user" });
        }

        // Insert the new category into the database
        const insertCategoryQuery = `
                INSERT INTO categories (UserID, CategoryName)
                VALUES (?, ?)
            `;

        connection.query(
          insertCategoryQuery,
          [userID, categoryName],
          (insertErr, insertResult) => {
            connection.release();
            if (insertErr) {
              console.error(insertErr);
              return res
                .status(500)
                .json({ error: "Failed to create the category" });
            }

            const insertedCategoryID = insertResult.insertId;
            return res.status(201).json({
              message: "Category created successfully",
              categoryID: insertedCategoryID,
            });
          }
        );
      }
    );
  });
});

router.put("/api/categories/:categoryID", authenticateUser, (req, res) => {
  const userID = req.userId; // Get the authenticated user's ID
  const categoryID = req.params.categoryID;
  const { categoryName } = req.body;
  // Validate input data
  if (!categoryName) {
    return res.status(400).json({ error: "Category name is required" });
  }

  pool.getConnection((getConnectionError, connection) => {
    if (getConnectionError) {
      console.error(getConnectionError);
      return res.status(500).json({ error: "Internal server error" });
    }

    // Check if the category exists for the user
    const checkCategoryQuery = `
            SELECT * FROM categories
            WHERE categoryID = ? AND userID = ?
        `;

    connection.query(
      checkCategoryQuery,
      [categoryID, userID],
      (categoryErr, categoryCheckResult) => {
        if (categoryErr) {
          console.error(categoryErr);
          connection.release();
          return res
            .status(500)
            .json({ error: "An error occurred while checking the category" });
        }

        if (categoryCheckResult.length === 0) {
          connection.release();
          return res.status(404).json({ error: "Category not found" });
        }

        // Update the category name in the database
        const updateCategoryQuery = `
                UPDATE categories
                SET CategoryName = ?
                WHERE CategoryID = ?
            `;

        connection.query(
          updateCategoryQuery,
          [categoryName, categoryID],
          (updateErr, updateResult) => {
            connection.release();
            if (updateErr) {
              console.error(updateErr);
              return res.status(500).json({
                error: "An error occurred while updating the category",
              });
            }

            return res
              .status(200)
              .json({ message: "Category updated successfully" });
          }
        );
      }
    );
  });
});

router.delete("/api/categories/:categoryID", authenticateUser, (req, res) => {
  const userID = req.userId; // Get the authenticated user's ID
  const categoryID = req.params.categoryID;

  pool.getConnection((getConnectionError, connection) => {
    if (getConnectionError) {
      console.error(getConnectionError);
      return res.status(500).json({ error: "Internal server error" });
    }

    // Check if the category exists for the user
    const checkCategoryQuery = `
            SELECT * FROM categories
            WHERE CategoryID = ? AND UserID = ?
        `;

    connection.query(
      checkCategoryQuery,
      [categoryID, userID],
      (categoryErr, categoryCheckResult) => {
        if (categoryErr) {
          console.error(categoryErr);
          connection.release();
          return res
            .status(500)
            .json({ error: "An error occurred while checking the category" });
        }

        if (categoryCheckResult.length === 0) {
          connection.release();
          return res.status(404).json({ error: "Category not found" });
        }

        // Delete the category from the database
        const deleteCategoryQuery = `
                DELETE FROM categories
                WHERE CategoryID = ?
            `;

        connection.query(
          deleteCategoryQuery,
          [categoryID],
          (deleteErr, deleteResult) => {
            connection.release();
            if (deleteErr) {
              console.error(deleteErr);
              return res.status(500).json({
                error: "An error occurred while deleting the category",
              });
            }

            return res
              .status(200)
              .json({ message: "Category deleted successfully" });
          }
        );
      }
    );
  });
});

module.exports = router;
