const express = require('express');
const authenticateUser = require('../middleware/authenticateUser');
const { pool } = require("../config/db");
const router = express.Router();

router.get('/api/tasks/upcoming/:userID', authenticateUser, (req, res) => {
    const userID = req.params.userID;

    // Retrieve upcoming tasks associated with the specified userID
    const getUpcomingTasksQuery = `
        SELECT * FROM tasks
        WHERE UserID = ? AND Completed = false AND Deadline >= NOW()
        ORDER BY Deadline ASC
    `;

    pool.getConnection((getConnectionError, connection) => {
        if (getConnectionError) {
            console.error(getConnectionError);
            return res.status(500).json({ error: "Internal server error" });
        }

        connection.query(getUpcomingTasksQuery, [userID], (err, tasksResult) => {
            connection.release();
            if (err) {
                console.error('Error retrieving upcoming tasks:', err);
                return res.status(500).json({ error: 'An error occurred while retrieving upcoming tasks' });
            }

            return res.status(200).json(tasksResult);
        });
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

    pool.getConnection((getConnectionError, connection) => {
        if (getConnectionError) {
            console.error(getConnectionError);
            return res.status(500).json({ error: "Internal server error" });
        }

        connection.query(getOverdueTasksQuery, [userID], (err, tasksResult) => {
            connection.release();
            if (err) {
                console.error('Error retrieving overdue tasks:', err);
                return res.status(500).json({ error: 'An error occurred while retrieving overdue tasks' });
            }

            return res.status(200).json(tasksResult);
        });
    });
});

router.get("/api/tasks/all", authenticateUser, (req, res) => {
    let userID = req.userId;
    // Retrieve all tasks associated with the specified userID
    const getAllTasksQuery = `
        SELECT t.*, c.CategoryName
        FROM tasks t
        JOIN categories c ON t.CategoryID = c.CategoryID
        WHERE t.UserID = ?
        ORDER BY t.Deadline DESC
    `;

    pool.getConnection((getConnectionError, connection) => {
        if (getConnectionError) {
            console.error(getConnectionError);
            return res.status(500).json({ error: "Internal server error" });
        }

        connection.query(getAllTasksQuery, [userID], (err, tasksResult) => {
            connection.release();
            if (err) {
                console.error("Error retrieving all tasks:", err);
                return res.status(500).json({ error: "An error occurred while retrieving all tasks" });
            }

            return res.status(200).json(tasksResult);
        });
    });
});

router.get("/api/tasks/today", authenticateUser, (req, res) => {
    let userID = req.userId;
    // Retrieve tasks due today associated with the specified userID
    const getTodayTasksQuery = `
        SELECT *
        FROM tasks
        WHERE UserID = ? AND Completed = false AND DATE(Deadline) = CURDATE()
        ORDER BY Deadline ASC
    `;

    pool.getConnection((getConnectionError, connection) => {
        if (getConnectionError) {
            console.error(getConnectionError);
            return res.status(500).json({ error: "Internal server error" });
        }

        connection.query(getTodayTasksQuery, [userID], (err, tasksResult) => {
            connection.release();
            if (err) {
                console.error("Error retrieving tasks due today:", err);
                return res.status(500).json({ error: "An error occurred while retrieving tasks due today" });
            }

            return res.status(200).json(tasksResult);
        });
    });
});

module.exports = router;
