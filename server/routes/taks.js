const express = require('express');
const authenticateUser = require('../middleware/authenticateUser');
const connection = require('../config/db');
const router = express.Router();


// update create task
router.post('/api/task', authenticateUser, (req, res) => {
    const { categoryName, taskName, description, priority, deadline } = req.body;

    // Validate input data
    if (!categoryName || !taskName || !priority || !deadline) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const userID = req.UserId; // Get the authenticated user's ID from req.user
    console.log("userID is >>>>>>> " + userID);

    // Insert the task into the Tasks table
    const insertTaskQuery = `
        INSERT INTO Tasks (UserID, CategoryID, TaskName, Description, Priority, Deadline, Completed)
        SELECT ?, CategoryID, ?, ?, ?, ?, ?
        FROM Categories
        WHERE UserID = ? AND CategoryName = ?
    `;

    connection.query(
        insertTaskQuery,
        [userID, taskName, description, priority, deadline, false, userID, categoryName],
        (error, results, fields) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error creating task' });
            }

            return res.status(201).json({ message: 'Task created successfully' });
        }
    );
});

router.put('/api/tasks/:taskID', authenticateUser, (req, res) => {
    const taskID = req.params.taskID;
    const { taskName, description, priority, deadline, completed } = req.body;

    // Validate input data
    if (!taskName || !priority || !deadline) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Update the task in the database
    const updateTaskQuery = `
        UPDATE tasks
        SET TaskName = ?, Description = ?, Priority = ?, Deadline = ?, Completed = ?
        WHERE TaskID = ?
    `;

    const values = [taskName, description, priority, deadline, completed, taskID];

    connection.query(updateTaskQuery, values, (err, result) => {
        if (err) {
            console.error('Error updating task:', err);
            return res.status(500).json({ error: 'An error occurred while updating the task' });
        }

        return res.status(200).json({ message: 'Task updated successfully' });
    });
});

router.delete('/api/tasks/:taskID', authenticateUser, (req, res) => {
    const taskID = req.params.taskID;

    // Delete the task from the database
    const deleteTaskQuery = `
        DELETE FROM tasks
        WHERE TaskID = ?
    `;

    connection.query(deleteTaskQuery, [taskID], (err, result) => {
        if (err) {
            console.error('Error deleting task:', err);
            return res.status(500).json({ error: 'An error occurred while deleting the task' });
        }

        return res.status(200).json({ message: 'Task deleted successfully' });
    });
});

router.put('/api/tasks/:taskID/complete', authenticateUser, (req, res) => {
    const taskID = req.params.taskID;

    // Update the task as completed in the database
    const completeTaskQuery = `
        UPDATE tasks
        SET Completed = true, CompletedDate = NOW()
        WHERE TaskID = ?
    `;

    connection.query(completeTaskQuery, [taskID], (err, result) => {
        if (err) {
            console.error('Error completing task:', err);
            return res.status(500).json({ error: 'An error occurred while completing the task' });
        }

        return res.status(200).json({ message: 'Task marked as completed' });
    });
});

module.exports = router;
