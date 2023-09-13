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



module.exports = router;
