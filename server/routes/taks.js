const express = require('express');
const authenticateUser = require('../middleware/authenticateUser');
const connection = require('../config/db');
const router = express.Router();

router.post('/api/task', authenticateUser, (req, res) => {
    const { categoryName, taskName, description, priority, deadline } = req.body;

    // Validate input data
    if (!categoryName || !taskName || !priority || !deadline) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const userID = req.params.userID; // Corrected from req.UserId

    // Insert the new task into the database
    const insertTaskQuery = `
        INSERT INTO tasks (UserID, CategoryName, TaskName, Description, Priority, Deadline)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    connection.query(
        insertTaskQuery,
        [userID, categoryName, taskName, description, priority, deadline],
        (err, insertResult) => {
            if (err) {
                console.error('Error inserting task:', err);
                return res.status(500).json({ error: 'An error occurred while inserting the task' });
            }

            const insertedTaskID = insertResult.insertId;
            return res.status(201).json({ message: 'Task created successfully', taskID: insertedTaskID });
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
