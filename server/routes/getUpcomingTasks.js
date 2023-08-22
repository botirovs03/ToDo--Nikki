const express = require('express');
const authenticateUser = require('../middleware/authenticateUser');
const connection = require('../config/db');
const router = express.Router();

router.get('/api/tasks/upcoming/:userID', authenticateUser, (req, res) => {
    const userID = req.params.userID;

    // Retrieve upcoming tasks associated with the specified userID
    const getUpcomingTasksQuery = `
        SELECT * FROM tasks
        WHERE userID = ? AND completed = false AND deadline >= NOW()
        ORDER BY deadline ASC
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
        WHERE userID = ? AND completed = false AND deadline < NOW()
        ORDER BY deadline ASC
    `;

    connection.query(getOverdueTasksQuery, [userID], (err, tasksResult) => {
        if (err) {
            console.error('Error retrieving overdue tasks:', err);
            return res.status(500).json({ error: 'An error occurred while retrieving overdue tasks' });
        }

        return res.status(200).json(tasksResult);
    });
});

module.exports = router;