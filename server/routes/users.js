const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateUser = require("../middleware/authenticateUser");
const { pool } = require("../config/db"); // Make sure you have the appropriate DB configuration

const SECRET_KEY = "your_secret_key";

const router = express.Router();

// Create user
router.post("/api/users", async (req, res) => {
  try {
    const { username, password, email } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertUserQuery = `INSERT INTO users (Username, Password, Email) VALUES (?, ?, ?)`;
    
    // Get a connection from the pool
    pool.getConnection((getConnectionError, connection) => {
      if (getConnectionError) {
        console.error(getConnectionError);
        return res.status(500).json({ error: "Internal server error" });
      }
      
      connection.query(
        insertUserQuery,
        [username, hashedPassword, email],
        (err, result) => {
          connection.release();
          if (err) {
            console.error(err);
            res
              .status(500)
              .json({ error: "Failed to register user", errormsg: err });
          } else {
            // After successfully registering the user, create a default category
            const userID = result.insertId; // Get the ID of the newly inserted user

            const insertCategoryQuery = `INSERT INTO categories (userID, categoryName) VALUES (?, "デフォルト")`;

            // Get another connection from the pool
            pool.getConnection((categoryConnectionError, categoryConnection) => {
              if (categoryConnectionError) {
                console.error(categoryConnectionError);
                return res.status(500).json({
                  error: "Internal server error",
                  errormsg: categoryConnectionError,
                });
              }

              categoryConnection.query(
                insertCategoryQuery,
                [userID],
                (categoryErr, categoryResult) => {
                  categoryConnection.release();
                  if (categoryErr) {
                    console.error(categoryErr);
                    res.status(500).json({
                      error: "Failed to create default category",
                      errormsg: categoryErr,
                    });
                  } else {
                    res
                      .status(201)
                      .json({
                        message: "User registered successfully",
                        categoryResult,
                      });
                  }
                }
              );
            });
          }
        }
      );
    });
  } catch (error) {
    console.error(error.Error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login user
router.post("/api/auth", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Get a connection from the pool
    pool.getConnection((getConnectionError, connection) => {
      if (getConnectionError) {
        console.error(getConnectionError);
        return res.status(500).json({ error: "Internal server error" });
      }

      // Find the user in the database
      connection.query(
        "SELECT * FROM users WHERE Email = ?",
        [email],
        async (error, results) => {
          connection.release();
          if (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
          }

          if (results.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
          }

          const user = results[0];
          const passwordMatch = await bcrypt.compare(password, user.Password);

          if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
          }

          const token = jwt.sign({ userId: user.UserID }, SECRET_KEY, {
            expiresIn: "72h",
          });
          res.status(200).json({ token });
        }
      );
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Access Resource with Token
router.get("/accessResource", authenticateUser, (req, res) => {
  try {
    res.status(200).json({ success: true, data: { userId: req.userId } });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// Update User
router.put("/api/users/:userID", authenticateUser, async (req, res) => {
  const userIdToUpdate = req.params.userID;
  const { username, password, email } = req.body;

  try {
    // Get a connection from the pool
    pool.getConnection((getConnectionError, connection) => {
      if (getConnectionError) {
        console.error(getConnectionError);
        return res.status(500).json({ error: "Internal server error" });
      }

      // Fetch the user's information from the database
      const fetchUserQuery = "SELECT * FROM users WHERE UserID = ?";
      connection.query(
        fetchUserQuery,
        [userIdToUpdate],
        async (error, results) => {
          connection.release();
          if (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
          }

          if (results.length === 0) {
            return res.status(404).json({ message: "User not found" });
          }

          const user = results[0];

          // Check if the authenticated user is the same as the user being updated
          if (req.userId !== user.UserID) {
            return res.status(403).json({
              message: "You do not have permission to update this user.",
            });
          }

          // Hash the new password if provided
          const updatedPassword = password
            ? await bcrypt.hash(password, 10)
            : user.Password;

          // Update user information in the database
          const updateUserQuery =
            "UPDATE users SET Username = ?, Email = ?, Password = ? WHERE UserID = ?";
          connection.query(
            updateUserQuery,
            [username, email, updatedPassword, userIdToUpdate],
            (error, results) => {
              if (error) {
                console.error("Error updating user:", error);
                return res.status(500).json({ message: "Internal server error" });
              }

              res.status(200).json({ message: "User updated successfully" });
            }
          );
        }
      );
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete User
router.delete("/api/users/:userID", authenticateUser, async (req, res) => {
  const userIdToDelete = req.params.userID;

  try {
    // Get a connection from the pool
    pool.getConnection((getConnectionError, connection) => {
      if (getConnectionError) {
        console.error(getConnectionError);
        return res.status(500).json({ error: "Internal server error" });
      }

      // Fetch the user's information from the database
      const fetchUserQuery = "SELECT * FROM users WHERE UserID = ?";
      connection.query(fetchUserQuery, [userIdToDelete], (error, results) => {
        connection.release();
        if (error) {
          console.error(error);
          return res.status(500).json({ message: "Internal server error" });
        }

        if (results.length === 0) {
          return res.status(404).json({ message: "User not found" });
        }

        const user = results[0];

        // Check if the authenticated user is authorized to delete this user
        if (req.userId !== user.UserID) {
          return res
            .status(403)
            .json({ message: "Not authorized to delete this user" });
        }

        // Proceed with user deletion
        const deleteUserQuery = "DELETE FROM users WHERE UserID = ?";
        connection.query(deleteUserQuery, [userIdToDelete], (error, results) => {
          if (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
          }

          res.status(200).json({ message: "User deleted successfully" });
        });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Define your API route
router.get("/api/checkuser", authenticateUser, (req, res) => {
  try {
    const userId = req.userId;
    // Define the SQL query to retrieve user data
    const sql = "SELECT * FROM users WHERE UserID = ?";

    // Get a connection from the pool
    pool.getConnection((getConnectionError, connection) => {
      if (getConnectionError) {
        console.error(getConnectionError);
        return res.status(500).json({ error: "Internal server error" });
      }

      // Execute the query with the userId parameter
      connection.query(sql, [userId], (error, results) => {
        connection.release();
        if (error) {
          console.error("Error executing SQL query:", error);
          res.status(500).json({ error: "Internal server error" });
          return;
        }

        // Check if a user with the provided userId exists
        if (results.length === 0) {
          res.status(404).json({ message: "User not found" });
          return;
        }

        // Retrieve the user data from the query results
        const user = results[0];

        // Access the username from the user data
        const userName = user.Username;

        // Respond with the username
        res.status(200).json({
          message: "User Logged In",
          UserName: userName,
          UserID: req.userId,
        });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
