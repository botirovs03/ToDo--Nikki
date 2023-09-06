const express = require('express');
const authenticateUser = require('../middleware/authenticateUser');
const connection = require('../config/db');
const router = express.Router();

router.post('/api/task', authenticateUser, (req, res) => {
    const { categoryID, taskName, description, priority, deadline } = req.body;

    // Validate input data
    if (!categoryID || !taskName || !priority || !deadline) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const userID = req.userId; // Get the authenticated user's ID from req.user
    console.log("userID is >>>>>>> " + userID);

    // Insert the task into the Tasks table
    const insertTaskQuery = `
        INSERT INTO Tasks (UserID, CategoryID, TaskName, Description, Priority, Deadline, Completed)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(
        insertTaskQuery,
        [userID, categoryID, taskName, description, priority, deadline, false],
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
    const { taskName, description, priority, deadline, completed, categoryName } = req.body;

    // Validate input data
    if (!taskName || !priority ) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Update the task in the database
    const updateTaskQuery = `
        UPDATE tasks
        SET taskName = ?, description = ?, priority = ?, deadline = ?, completed = ?, CategoryID = ?
        WHERE taskID = ?
    `;

    const values = [taskName, description, priority, deadline, completed, categoryName, taskID];

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
        WHERE taskID = ?
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

    // Retrieve the current completion status of the task
    const getCompletionStatusQuery = `
        SELECT completed
        FROM tasks
        WHERE taskID = ?
    `;

    connection.query(getCompletionStatusQuery, [taskID], (err, rows) => {
        if (err) {
            console.error('Error retrieving task completion status:', err);
            return res.status(500).json({ error: 'An error occurred while retrieving the task completion status' });
        }

        if (rows.length !== 1) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const currentStatus = rows[0].completed;
        const newStatus = !currentStatus;

        // Update the task with the new completion status
        const updateCompletionStatusQuery = `
            UPDATE tasks
            SET completed = ?, completedDate = NOW()
            WHERE taskID = ?
        `;

        connection.query(updateCompletionStatusQuery, [newStatus, taskID], (err, result) => {
            if (err) {
                console.error('Error toggling task completion status:', err);
                return res.status(500).json({ error: 'An error occurred while toggling the task completion status' });
            }

            return res.status(200).json({ message: 'Task completion status toggled', completed: newStatus });
        });
    });
});

module.exports = router;
