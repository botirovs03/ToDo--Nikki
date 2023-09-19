const express = require("express");
const authenticateUser = require("../middleware/authenticateUser");
const { pool } = require("../config/db");
const router = express.Router();

router.get("/api/categories", authenticateUser, (req, res) => {
  const userID = req.userId;
  // Retrieve categories associated with the specified userID
  const getCategoryQuery = `
    SELECT
      c.*,
      COUNT(t.CategoryID) AS taskCount
    FROM
      categories c
    LEFT JOIN
      tasks t ON c.CategoryID = t.CategoryID
    WHERE
      c.UserID = ?
    GROUP BY
      c.CategoryID;
  `;

  pool.getConnection((getConnectionError, connection) => {
    if (getConnectionError) {
      console.error(getConnectionError);
      return res
        .status(500)
        .json({ error: "Internal server error" });
    }

    connection.query(getCategoryQuery, [userID], (err, categoryResult) => {
      connection.release();
      if (err) {
        console.error("Error retrieving categories:", err);
        return res
          .status(500)
          .json({ error: "An error occurred while retrieving categories" });
      }

      return res.status(200).json(categoryResult);
    });
  });
});

router.get("/api/category/tasks/:categoryID", authenticateUser, (req, res) => {
  const categoryID = req.params.categoryID;

  // Retrieve tasks associated with the specified categoryID
  const getTasksQuery = `
    SELECT * FROM tasks
    WHERE CategoryID = ?
  `;

  pool.getConnection((getConnectionError, connection) => {
    if (getConnectionError) {
      console.error(getConnectionError);
      return res
        .status(500)
        .json({ error: "Internal server error" });
    }

    connection.query(getTasksQuery, [categoryID], (err, tasksResult) => {
      connection.release();
      if (err) {
        console.error("Error retrieving tasks:", err);
        return res
          .status(500)
          .json({ error: "An error occurred while retrieving tasks" });
      }

      return res.status(200).json(tasksResult);
    });
  });
});

router.get("/api/tasks/user/:userID", authenticateUser, (req, res) => {
  const userID = req.params.userID;

  // Retrieve tasks associated with the specified userID
  const getTasksQuery = `
    SELECT * FROM tasks
    WHERE UserID = ?
  `;

  pool.getConnection((getConnectionError, connection) => {
    if (getConnectionError) {
      console.error(getConnectionError);
      return res
        .status(500)
        .json({ error: "Internal server error" });
    }

    connection.query(getTasksQuery, [userID], (err, tasksResult) => {
      connection.release();
      if (err) {
        console.error("Error retrieving tasks:", err);
        return res
          .status(500)
          .json({ error: "An error occurred while retrieving tasks" });
      }

      return res.status(200).json(tasksResult);
    });
  });
});

module.exports = router;
