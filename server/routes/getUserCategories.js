const express = require('express');
const authenticateUser = require('../middleware/authenticateUser');
const connection = require('../config/db');
const router = express.Router();

router.get('/api/categories/:userID', authenticateUser, (req, res) => {
    const userID = req.params.userID;

    // Retrieve categories associated with the specified userID
    const getCategoryQuery = `
        SELECT * FROM categories
        WHERE userID = ?
    `;

    connection.query(getCategoryQuery, [userID], (err, categoryResult) => {
        if (err) {
            console.error('Error retrieving categories:', err);
            return res.status(500).json({ error: 'An error occurred while retrieving categories' });
        }

        return res.status(200).json(categoryResult);
    });
});

router.get('/api/tasks/:categoryID', authenticateUser, (req, res) => {
    const categoryID = req.params.categoryID;

    // Retrieve tasks associated with the specified categoryID
    const getTasksQuery = `
        SELECT * FROM tasks
        WHERE categoryID = ?
    `;

    connection.query(getTasksQuery, [categoryID], (err, tasksResult) => {
        if (err) {
            console.error('Error retrieving tasks:', err);
            return res.status(500).json({ error: 'An error occurred while retrieving tasks' });
        }

        return res.status(200).json(tasksResult);
    });
});

router.get('/api/tasks/user/:userID', authenticateUser, (req, res) => {
    const userID = req.params.userID;

    // Retrieve tasks associated with the specified userID
    const getTasksQuery = `
        SELECT * FROM tasks
        WHERE userID = ?
    `;

    connection.query(getTasksQuery, [userID], (err, tasksResult) => {
        if (err) {
            console.error('Error retrieving tasks:', err);
            return res.status(500).json({ error: 'An error occurred while retrieving tasks' });
        }

        return res.status(200).json(tasksResult);
    });
});

router.get('/api/tasks/:taskID', authenticateUser, (req, res) => {
    const taskID = req.params.taskID;

    // Retrieve details of the specified task
    const getTaskQuery = `
        SELECT * FROM tasks
        WHERE taskID = ?
    `;

    connection.query(getTaskQuery, [taskID], (err, taskResult) => {
        if (err) {
            console.error('Error retrieving task:', err);
            return res.status(500).json({ error: 'An error occurred while retrieving the task' });
        }

        if (taskResult.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        return res.status(200).json(taskResult[0]);
    });
});


module.exports = router;