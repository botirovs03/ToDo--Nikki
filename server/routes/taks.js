const express = require("express");
const moment = require("moment-timezone");

const authenticateUser = require("../middleware/authenticateUser");
const { pool } = require("../config/db");
const router = express.Router();

// Set the desired time zone (e.g., Japan)
const japanTimeZone = "Asia/Tokyo";
moment.tz.setDefault(japanTimeZone);

router.post("/api/task", authenticateUser, (req, res) => {
  const { categoryID, taskName, description, priority, deadline } = req.body;

  // Validate input data
  if (!categoryID || !taskName || !priority) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Convert to Japan time
  const deadlineJap = moment(deadline).format("YYYY-MM-DD HH:mm:ss");

  const userID = req.userId; // Get the authenticated user's ID from req.user

  // Insert the task into the Tasks table
  const insertTaskQuery = `
    INSERT INTO tasks (UserID, CategoryID, TaskName, Description, Priority, Deadline, Completed)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  pool.getConnection((getConnectionError, connection) => {
    if (getConnectionError) {
      console.error(getConnectionError);
      return res.status(500).json({ error: "Internal server error" });
    }

    connection.query(
      insertTaskQuery,
      [userID, categoryID, taskName, description, priority, deadlineJap, false],
      (error, results, fields) => {
        connection.release();
        if (error) {
          console.error(error);
          return res.status(500).json({ error: "Error creating task" });
        }

        return res.status(201).json({ message: "Task created successfully" });
      }
    );
  });
});

router.put("/api/tasks/:taskID", authenticateUser, (req, res) => {
  const taskID = req.params.taskID;
  const { taskName, description, priority, deadline, completed, categoryName } =
    req.body;

  // Validate input data
  if (!taskName || !priority) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Convert to Japan time
  const deadlineJap = moment(deadline).format("YYYY-MM-DD HH:mm:ss");

  // Update the task in the database
  const updateTaskQuery = `
    UPDATE tasks
    SET TaskName = ?, Description = ?, Priority = ?, Deadline = ?, Completed = ?, CategoryID = ?
    WHERE TaskID = ?
  `;

  const values = [
    taskName,
    description,
    priority,
    deadlineJap,
    completed,
    categoryName,
    taskID,
  ];

  pool.getConnection((getConnectionError, connection) => {
    if (getConnectionError) {
      console.error(getConnectionError);
      return res.status(500).json({ error: "Internal server error" });
    }

    connection.query(updateTaskQuery, values, (err, result) => {
      connection.release();
      if (err) {
        console.error("Error updating task:", err);
        return res
          .status(500)
          .json({ error: "An error occurred while updating the task" });
      }

      return res.status(200).json({ message: "Task updated successfully" });
    });
  });
});

router.delete("/api/tasks/:taskID", authenticateUser, (req, res) => {
  const taskID = req.params.taskID;

  // Delete the task from the database
  const deleteTaskQuery = `
    DELETE FROM tasks
    WHERE TaskID = ?
  `;

  pool.getConnection((getConnectionError, connection) => {
    if (getConnectionError) {
      console.error(getConnectionError);
      return res.status(500).json({ error: "Internal server error" });
    }

    connection.query(deleteTaskQuery, [taskID], (err, result) => {
      connection.release();
      if (err) {
        console.error("Error deleting task:", err);
        return res
          .status(500)
          .json({ error: "An error occurred while deleting the task" });
      }

      return res.status(200).json({ message: "Task deleted successfully" });
    });
  });
});

router.put("/api/tasks/:taskID/complete", authenticateUser, (req, res) => {
  const taskID = req.params.taskID;

  // Retrieve the current completion status of the task
  const getCompletionStatusQuery = `
    SELECT Completed
    FROM tasks
    WHERE TaskID = ?
  `;

  pool.getConnection((getConnectionError, connection) => {
    if (getConnectionError) {
      console.error(getConnectionError);
      return res.status(500).json({ error: "Internal server error" });
    }

    connection.query(getCompletionStatusQuery, [taskID], (err, rows) => {
      if (err) {
        connection.release();
        console.error("Error retrieving task completion status:", err);
        return res.status(500).json({
          error: "An error occurred while retrieving the task completion status",
        });
      }

      if (rows.length !== 1) {
        connection.release();
        return res.status(404).json({ error: "Task not found" });
      }

      const currentStatus = rows[0].Completed;
      const newStatus = !currentStatus;
      let completedate = moment().format("YYYY-MM-DD HH:mm:ss");
      if (!newStatus) {
        completedate = null;
      }

      // Update the task with the new completion status
      const updateCompletionStatusQuery = `
        UPDATE tasks
        SET Completed = ?, CompletedDate = ?
        WHERE TaskID = ?
      `;

      connection.query(
        updateCompletionStatusQuery,
        [newStatus, completedate, taskID],
        (err, result) => {
          connection.release();
          if (err) {
            console.error("Error toggling task completion status:", err);
            return res.status(500).json({
              error:
                "An error occurred while toggling the task completion status",
            });
          }

          return res.status(200).json({
            message: "Task completion status toggled",
            completed: newStatus,
          });
        }
      );
    });
  });
});

module.exports = router;
