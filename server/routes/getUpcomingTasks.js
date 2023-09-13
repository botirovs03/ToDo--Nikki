const express = require("express");
const moment = require("moment-timezone");

const authenticateUser = require("../middleware/authenticateUser");
const connection = require("../config/db");
const router = express.Router();

router.get("/api/tasks/upcoming", authenticateUser, (req, res) => {
  // const userID = req.params.userID;
  let userID = req.userId;
  console.log("hello" + userID);
  // Retrieve upcoming tasks associated with the specified userID
  const getUpcomingTasksQuery = `
        SELECT * FROM tasks
        WHERE userID = ? AND completed = false AND deadline <= NOW()
        ORDER BY deadline ASCn
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

router.get("/api/tasks/overdue/:userID", authenticateUser, (req, res) => {
  const userID = req.params.userID;

  // Retrieve overdue tasks associated with the specified userID
  const getOverdueTasksQuery = `
        SELECT * FROM tasks
        WHERE userID = ? AND completed = false AND deadline < NOW()
        ORDER BY deadline ASC
    `;

  connection.query(getOverdueTasksQuery, [userID], (err, tasksResult) => {
    if (err) {
      console.error("Error retrieving overdue tasks:", err);
      return res
        .status(500)
        .json({ error: "An error occurred while retrieving overdue tasks" });
    }

    return res.status(200).json(tasksResult);
  });
});

router.get("/api/uncomplete", authenticateUser, (req, res) => {
  // const userID = req.params.userID;
  let userID = req.userId;
  console.log("hello" + userID);
  // Retrieve upcoming tasks associated with the specified userID
  const getUpcomingTasksQuery = `
  SELECT t.*, c.CategoryName
    FROM tasks t
    JOIN categories c ON t.CategoryID = c.CategoryID
    WHERE t.UserID = ? AND t.Completed = false
    ORDER BY t.TaskID DESC;
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

router.get("/api/complete", authenticateUser, (req, res) => {
  // const userID = req.params.userID;
  let userID = req.userId;
  console.log("hello" + userID);
  // Retrieve upcoming tasks associated with the specified userID
  const getUpcomingTasksQuery = `
  SELECT t.*, c.CategoryName
    FROM tasks t
    JOIN categories c ON t.CategoryID = c.CategoryID
    WHERE t.UserID = ? AND t.Completed = true
    ORDER BY t.TaskID DESC;
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

router.get("/api/all", authenticateUser, (req, res) => {
  // const userID = req.params.userID;
  let userID = req.userId;
  // Retrieve upcoming tasks associated with the specified userID
  const getUpcomingTasksQuery = `
    SELECT t.*, c.CategoryName
    FROM tasks t
    JOIN categories c ON t.CategoryID = c.CategoryID
    WHERE t.UserID = ?
    ORDER BY t.TaskID DESC;
    `;

  connection.query(getUpcomingTasksQuery, [userID], (err, tasksResult) => {
    if (err) {
      console.error("Error retrieving upcoming tasks:", err);
      return res
        .status(500)
        .json({ error: "An error occurred while retrieving upcoming tasks" });
    }
    const formattedTasksResult = tasksResult.map((task) => {
      // Assuming task.date is a database column containing date-time information
      const dateTime = moment(task.Deadline);

      // Format the date-time in the desired format
      const formattedDateTime = dateTime.format("YYYY-MM-DD HH:mm:ss");

      // Return the formatted date-time
      return {
        ...task,
        Deadline: formattedDateTime,
      };
    });
    console.log(formattedTasksResult);
    return res.status(200).json(formattedTasksResult);
  });
});

router.get("/api/calendar", authenticateUser, (req, res) => {
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
    const formattedTasksResult = tasksResult.map((task) => {
      // Assuming task.date is a database column containing date-time information
      const dateTime = moment(task.Deadline);

      // Format the date-time in the desired format
      const formattedDateTime = dateTime.format("YYYY-MM-DD HH:mm:ss");

      // Return the formatted date-time
      return {
        ...task,
        Deadline: formattedDateTime,
      };
    });
    console.log(formattedTasksResult);
    return res.status(200).json(formattedTasksResult);
  });
});

router.get("/api/today", authenticateUser, (req, res) => {
  // const userID = req.params.userID;
  let userID = req.userId;
  console.log("hello" + userID);
  // Retrieve upcoming tasks associated with the specified userID
  const getUpcomingTasksQuery = `
  SELECT t.*, c.CategoryName
    FROM tasks t
    JOIN categories c ON t.CategoryID = c.CategoryID
    WHERE t.UserID = ? AND t.Completed = false AND DATE(t.Deadline) = ?
  ORDER BY Deadline ASC;
    `;
  const dateTime = moment().format("YYYY-MM-DD");
  console.log(dateTime)
  connection.query(getUpcomingTasksQuery, [userID, dateTime], (err, tasksResult) => {
    if (err) {
      console.error("Error retrieving upcoming tasks:", err);
      return res
        .status(500)
        .json({ error: "An error occurred while retrieving upcoming tasks" });
    }
    const formattedTasksResult = tasksResult.map((task) => {
      // Assuming task.date is a database column containing date-time information
      const dateTime = moment(task.Deadline);

      // Format the date-time in the desired format
      const formattedDateTime = dateTime.format("YYYY-MM-DD HH:mm:ss");

      // Return the formatted date-time
      return {
        ...task,
        Deadline: formattedDateTime,
      };
    });
    console.log(formattedTasksResult);
    return res.status(200).json(formattedTasksResult);
  });
});

router.get("/api/tasks/:taskID", authenticateUser, (req, res) => {
  const taskID = req.params.taskID;
  console.log(taskID);
  // Retrieve details of the specified task
  const getTaskQuery = `
    SELECT t.*, c.CategoryName
    FROM tasks t
    JOIN categories c ON t.CategoryID = c.CategoryID
    WHERE t.TaskID = ?
    ORDER BY t.Deadline DESC;
    `;

  connection.query(getTaskQuery, [taskID], (err, taskResult) => {
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
        // Assuming task.date is a database column containing date-time information
        const dateTime = moment(task.Deadline);
  
        // Format the date-time in the desired format
        const formattedDateTime = dateTime.format("YYYY-MM-DD HH:mm:ss");
  
        // Return the formatted date-time
        return {
          ...task,
          Deadline: formattedDateTime,
        };
      });
      console.log(formattedTasksResult);

      return res.status(200).json(formattedTasksResult[0]);
    } catch (error) {
      console.error("Task retrieval error:", error.message);
      return res.status(404).json({ error: error.message });
    }
  });
});

module.exports = router;
