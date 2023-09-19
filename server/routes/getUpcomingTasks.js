const express = require("express");
const moment = require("moment-timezone");

const authenticateUser = require("../middleware/authenticateUser");
const { pool } = require("../config/db");
const router = express.Router();

router.get("/api/tasks/upcoming", authenticateUser, (req, res) => {
  let userID = req.userId;
  const getUpcomingTasksQuery = `
        SELECT * FROM tasks
        WHERE UserID = ? AND Completed = false AND Deadline <= NOW()
        ORDER BY Deadline ASC
    `;

  pool.getConnection((getConnectionError, connection) => {
    if (getConnectionError) {
      console.error(getConnectionError);
      return res
        .status(500)
        .json({ error: "Internal server error" });
    }

    connection.query(getUpcomingTasksQuery, [userID], (err, tasksResult) => {
      connection.release();
      if (err) {
        console.error("Error retrieving upcoming tasks:", err);
        return res
          .status(500)
          .json({ error: "An error occurred while retrieving upcoming tasks" });
      }

      return res.status(200).json(tasksResult);
    });
  });
});

router.get("/api/tasks/overdue/:userID", authenticateUser, (req, res) => {
  const userID = req.params.userID;
  const getOverdueTasksQuery = `
        SELECT * FROM tasks
        WHERE UserID = ? AND Completed = false AND Deadline < NOW()
        ORDER BY Deadline ASC
    `;

  pool.getConnection((getConnectionError, connection) => {
    if (getConnectionError) {
      console.error(getConnectionError);
      return res
        .status(500)
        .json({ error: "Internal server error" });
    }

    connection.query(getOverdueTasksQuery, [userID], (err, tasksResult) => {
      connection.release();
      if (err) {
        console.error("Error retrieving overdue tasks:", err);
        return res
          .status(500)
          .json({ error: "An error occurred while retrieving overdue tasks" });
      }

      return res.status(200).json(tasksResult);
    });
  });
});

router.get("/api/uncomplete", authenticateUser, (req, res) => {
  let userID = req.userId;
  const getUpcomingTasksQuery = `
  SELECT t.*, c.CategoryName
    FROM tasks t
    JOIN categories c ON t.CategoryID = c.CategoryID
    WHERE t.UserID = ? AND t.Completed = false
    ORDER BY t.TaskID DESC;
  `;

  pool.getConnection((getConnectionError, connection) => {
    if (getConnectionError) {
      console.error(getConnectionError);
      return res
        .status(500)
        .json({ error: "Internal server error" });
    }

    connection.query(getUpcomingTasksQuery, [userID], (err, tasksResult) => {
      connection.release();
      if (err) {
        console.error("Error retrieving upcoming tasks:", err);
        return res
          .status(500)
          .json({ error: "An error occurred while retrieving upcoming tasks" });
      }

      return res.status(200).json(tasksResult);
    });
  });
});

router.get("/api/complete", authenticateUser, (req, res) => {
  let userID = req.userId;
  const getUpcomingTasksQuery = `
  SELECT t.*, c.CategoryName
    FROM tasks t
    JOIN categories c ON t.CategoryID = c.CategoryID
    WHERE t.UserID = ? AND t.Completed = true
    ORDER BY t.TaskID DESC;
  `;

  pool.getConnection((getConnectionError, connection) => {
    if (getConnectionError) {
      console.error(getConnectionError);
      return res
        .status(500)
        .json({ error: "Internal server error" });
    }

    connection.query(getUpcomingTasksQuery, [userID], (err, tasksResult) => {
      connection.release();
      if (err) {
        console.error("Error retrieving upcoming tasks:", err);
        return res
          .status(500)
          .json({ error: "An error occurred while retrieving upcoming tasks" });
      }

      return res.status(200).json(tasksResult);
    });
  });
});

router.get("/api/all", authenticateUser, (req, res) => {
  let userID = req.userId;
  const getUpcomingTasksQuery = `
    SELECT t.*, c.CategoryName
    FROM tasks t
    JOIN categories c ON t.CategoryID = c.CategoryID
    WHERE t.UserID = ?
    ORDER BY t.TaskID DESC;
  `;

  pool.getConnection((getConnectionError, connection) => {
    if (getConnectionError) {
      console.error(getConnectionError);
      return res
        .status(500)
        .json({ error: "Internal server error" });
    }

    connection.query(getUpcomingTasksQuery, [userID], (err, tasksResult) => {
      connection.release();
      if (err) {
        console.error("Error retrieving upcoming tasks:", err);
        return res
          .status(500)
          .json({ error: "An error occurred while retrieving upcoming tasks" });
      }

      const formattedTasksResult = tasksResult.map((task) => {
        const dateTime = moment(task.Deadline);
        const formattedDateTime = dateTime.format("YYYY-MM-DD HH:mm:ss");
        return {
          ...task,
          Deadline: formattedDateTime,
        };
      });

      return res.status(200).json(formattedTasksResult);
    });
  });
});

router.get("/api/calendar", authenticateUser, (req, res) => {
  let userID = req.userId;
  const getUpcomingTasksQuery = `
    SELECT t.*, c.CategoryName
    FROM tasks t
    JOIN categories c ON t.CategoryID = c.CategoryID
    WHERE t.UserID = ?
    ORDER BY t.Deadline DESC;
  `;

  pool.getConnection((getConnectionError, connection) => {
    if (getConnectionError) {
      console.error(getConnectionError);
      return res
        .status(500)
        .json({ error: "Internal server error" });
    }

    connection.query(getUpcomingTasksQuery, [userID], (err, tasksResult) => {
      connection.release();
      if (err) {
        console.error("Error retrieving upcoming tasks:", err);
        return res
          .status(500)
          .json({ error: "An error occurred while retrieving upcoming tasks" });
      }

      const formattedTasksResult = tasksResult.map((task) => {
        const dateTime = moment(task.Deadline);
        const formattedDateTime = dateTime.format("YYYY-MM-DD HH:mm:ss");
        return {
          ...task,
          Deadline: formattedDateTime,
        };
      });

      return res.status(200).json(formattedTasksResult);
    });
  });
});

router.get("/api/today", authenticateUser, (req, res) => {
  let userID = req.userId;
  const getUpcomingTasksQuery = `
  SELECT t.*, c.CategoryName
    FROM tasks t
    JOIN categories c ON t.CategoryID = c.CategoryID
    WHERE t.UserID = ? AND t.Completed = false AND DATE(t.Deadline) = ?
    ORDER BY Deadline ASC;
  `;
  const dateTime = moment().format("YYYY-MM-DD");

  pool.getConnection((getConnectionError, connection) => {
    if (getConnectionError) {
      console.error(getConnectionError);
      return res
        .status(500)
        .json({ error: "Internal server error" });
    }

    connection.query(getUpcomingTasksQuery, [userID, dateTime], (err, tasksResult) => {
      connection.release();
      if (err) {
        console.error("Error retrieving upcoming tasks:", err);
        return res
          .status(500)
          .json({ error: "An error occurred while retrieving upcoming tasks" });
      }

      const formattedTasksResult = tasksResult.map((task) => {
        const dateTime = moment(task.Deadline);
        const formattedDateTime = dateTime.format("YYYY-MM-DD HH:mm:ss");
        return {
          ...task,
          Deadline: formattedDateTime,
        };
      });

      return res.status(200).json(formattedTasksResult);
    });
  });
});

router.get("/api/tasks/:taskID", authenticateUser, (req, res) => {
  const taskID = req.params.taskID;
  const getTaskQuery = `
    SELECT t.*, c.CategoryName
    FROM tasks t
    JOIN categories c ON t.CategoryID = c.CategoryID
    WHERE t.TaskID = ?
    ORDER BY t.Deadline DESC;
  `;

  pool.getConnection((getConnectionError, connection) => {
    if (getConnectionError) {
      console.error(getConnectionError);
      return res
        .status(500)
        .json({ error: "Internal server error" });
    }

    connection.query(getTaskQuery, [taskID], (err, taskResult) => {
      connection.release();
      if (err) {
        console.error("Error retrieving task:", err);
        return res
          .status(500)
          .json({ error: "An error occurred while retrieving the task" });
      }

      try {
        if (taskResult.length === 0) {
          throw new Error("Task not found");
        }
        const formattedTasksResult = taskResult.map((task) => {
          const dateTime = moment(task.Deadline);
          const formattedDateTime = dateTime.format("YYYY-MM-DD HH:mm:ss");
          return {
            ...task,
            Deadline: formattedDateTime,
          };
        });

        return res.status(200).json(formattedTasksResult[0]);
      } catch (error) {
        console.error("Task retrieval error:", error.message);
        return res.status(404).json({ error: error.message });
      }
    });
  });
});

module.exports = router;
