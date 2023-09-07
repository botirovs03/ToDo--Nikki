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
  console.log("hello" + userID);
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

router.get("/api/today", authenticateUser, (req, res) => {
  // const userID = req.params.userID;
  let userID = req.userId;
  console.log("hello" + userID);
  // Retrieve upcoming tasks associated with the specified userID
  const getUpcomingTasksQuery = `
  SELECT *
  FROM tasks
  WHERE UserID = ? AND Completed = false AND DATE(Deadline) = ?
  ORDER BY Deadline ASC;
    `;
  const dateTime = moment().format("YYYY-MM-DD");
  connection.query(getUpcomingTasksQuery, [userID, dateTime], (err, tasksResult) => {
    if (err) {
      console.error("Error retrieving upcoming tasks:", err);
      return res
        .status(500)
        .json({ error: "An error occurred while retrieving upcoming tasks" });
    }
    console.log(tasksResult)
    return res.status(200).json(tasksResult);
  });
});

module.exports = router;
