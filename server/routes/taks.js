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

    // Retrieve userID and categoryID from categories table using categoryName
    const getCategoryQuery = `
        SELECT UserID, CategoryID FROM categories WHERE CategoryName = ?
    `;

    connection.query(getCategoryQuery, [categoryName], (err, categoryResult) => {
        if (err) {
            console.error('Error retrieving category:', err);
            return res.status(500).json({ error: 'An error occurred while retrieving the category' });
        }

        if (categoryResult.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }

        const { UserID, CategoryID } = categoryResult[0];

        // Insert the task into the database
        const insertTaskQuery = `
            INSERT INTO tasks (UserID, CategoryID, TaskName, Description, Priority, Deadline, Completed)
            VALUES (?, ?, ?, ?, ?, ?, false)
        `;

        const values = [UserID, CategoryID, taskName, description, priority, deadline];

        connection.query(insertTaskQuery, values, (err, result) => {
            if (err) {
                console.error('Error inserting task:', err);
                return res.status(500).json({ error: 'An error occurred while inserting the task' });
            }

            const insertedTaskID = result.insertId;
            return res.status(201).json({ message: 'Task inserted successfully', taskID: insertedTaskID });
        });
    });
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
