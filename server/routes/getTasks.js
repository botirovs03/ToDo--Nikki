const express = require('express');
const authenticateUser = require('../middleware/authenticateUser');
const {connection} = require("../config/db");
const router = express.Router();

router.get('/api/tasks/upcoming/:userID', authenticateUser, (req, res) => {
    const userID = req.params.userID;

    // Retrieve upcoming tasks associated with the specified userID
    const getUpcomingTasksQuery = `
        SELECT * FROM tasks
        WHERE UserID = ? AND Completed = false AND Deadline >= NOW()
        ORDER BY Deadline ASC
    `;

    connection.query(getUpcomingTasksQuery, [userID], (err, tasksResult) => {
        if (err) {
            console.error('Error retrieving upcoming tasks:', err);
            return res.status(500).json({ error: 'An error occurred while retrieving upcoming tasks' });
        }

        return res.status(200).json(tasksResult);
    });
});


router.get('/api/tasks/overdue/:userID', authenticateUser, (req, res) => {
    const userID = req.params.userID;

    // Retrieve overdue tasks associated with the specified userID
    const getOverdueTasksQuery = `
        SELECT * FROM tasks
        WHERE UserID = ? AND Completed = false AND Deadline < NOW()
        ORDER BY Deadline ASC
    `;

    connection.query(getOverdueTasksQuery, [userID], (err, tasksResult) => {
        if (err) {
            console.error('Error retrieving overdue tasks:', err);
            return res.status(500).json({ error: 'An error occurred while retrieving overdue tasks' });
        }

        return res.status(200).json(tasksResult);
    });
});


router.get("/api/tasks/all", authenticateUser, (req, res) => {
  // const userID = req.params.userID;
  let userID = req.userId;
  // Retrieve upcoming tasks associated with the specified userID
  const getUpcomingTasksQuery = `
    SELECT t.*, c.CategoryName
    FROM tasks t
    JOIN categories c ON t.CategoryID = c.CategoryID
    WHERE t.UserID = ?
    ORDER BY t.Deadline DESC;
    `;

  connection.query(getUpcomingTasksQuery, [userID], (err, tasksResult) => {
    if (err) {
      console.error("Error retrieving upcoming tasks:", err);
      return res
        .status(500)
        .json({ error: "An error occurred while retrieving upcoming tasks" });
    }

    return res.status(200).json(tasksResult);
  });
});

router.get("/api/tasks/today", authenticateUser, (req, res) => {
    // const userID = req.params.userID;
    let userID = req.userId;
    // Retrieve upcoming tasks associated with the specified userID
    const getUpcomingTasksQuery = `
    SELECT *
    FROM tasks
    WHERE UserID = ? AND Completed = false AND DATE(Deadline) = CURDATE()
    ORDER BY Deadline ASC;
    
      `;
  
    connection.query(getUpcomingTasksQuery, [userID], (err, tasksResult) => {
      if (err) {
        console.error("Error retrieving upcoming tasks:", err);
        return res
          .status(500)
          .json({ error: "An error occurred while retrieving upcoming tasks" });
      }
  
      return res.status(200).json(tasksResult);
    });
  });

module.exports = router;