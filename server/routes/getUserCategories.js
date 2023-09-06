const express = require("express");
const authenticateUser = require("../middleware/authenticateUser");
const connection = require("../config/db");
const router = express.Router();

router.get("/api/categories", authenticateUser, (req, res) => {
  const userID = req.userId;
  console.log(userID);
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
  c.userID = ?
GROUP BY
  c.CategoryID;
    `;

  connection.query(getCategoryQuery, [userID], (err, categoryResult) => {
    if (err) {
      console.error("Error retrieving categories:", err);
      return res
        .status(500)
        .json({ error: "An error occurred while retrieving categories" });
    }

    return res.status(200).json(categoryResult);
  });
});

router.get("/api/category/tasks/:categoryID", authenticateUser, (req, res) => {
  const categoryID = req.params.categoryID;

  // Retrieve tasks associated with the specified categoryID
  const getTasksQuery = `
        SELECT * FROM tasks
        WHERE categoryID = ?
    `;

  connection.query(getTasksQuery, [categoryID], (err, tasksResult) => {
    if (err) {
      console.error("Error retrieving tasks:", err);
      return res
        .status(500)
        .json({ error: "An error occurred while retrieving tasks" });
    }

    return res.status(200).json(tasksResult);
  });
});

router.get("/api/tasks/user/:userID", authenticateUser, (req, res) => {
  const userID = req.params.userID;

  // Retrieve tasks associated with the specified userID
  const getTasksQuery = `
        SELECT * FROM tasks
        WHERE userID = ?
    `;

  connection.query(getTasksQuery, [userID], (err, tasksResult) => {
    if (err) {
      console.error("Error retrieving tasks:", err);
      return res
        .status(500)
        .json({ error: "An error occurred while retrieving tasks" });
    }

    return res.status(200).json(tasksResult);
  });
});

router.get("/api/tasks/:taskID", authenticateUser, (req, res) => {
  const taskID = req.params.taskID;
  console.log(taskID);
  // Retrieve details of the specified task
  const getTaskQuery = `
    SELECT t.*, c.CategoryName
    FROM tasks t
    JOIN categories c ON t.CategoryID = c.CategoryID
    WHERE t.TaskID = ?
    ORDER BY t.Deadline DESC;
    `;

  connection.query(getTaskQuery, [taskID], (err, taskResult) => {
    if (err) {
      console.error("Error retrieving task:", err);
      return res
        .status(500)
        .json({ error: "An error occurred while retrieving the task" });
    }

    try {
      if (taskResult.length === 0) {
        throw new Error("Task not found");
      }

      return res.status(200).json(taskResult[0]);
    } catch (error) {
      console.error("Task retrieval error:", error.message);
      return res.status(404).json({ error: error.message });
    }
  });
});

module.exports = router;
