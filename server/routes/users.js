const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateUser = require("../middleware/authenticateUser");
const connection = require("../config/db"); // Your updated database configuration with mysql2

const SECRET_KEY = "your_secret_key_here";
const router = express.Router();

router.post("/api/users", async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into the database
    const insertUserQuery =
      "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";
    connection.query(
      insertUserQuery,
      [username, hashedPassword, email],
      (err, results) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Failed to register user" });
        } else {
          // User registration successful
          res.status(201).json({ message: "User registered successfully" });
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/api/auth", async (req, res) => {
  try {
    const { username, password } = req.body;
    // console.log(req.body)

    // Fetch user from the database based on the username
    const selectUserQuery = "SELECT * FROM users WHERE Username = ?";
    connection.query(selectUserQuery, [username], async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const user = results[0];
      console.log(user.Password)
      // Compare the provided password with the hashed password in the database
      const passwordMatch = await bcrypt.compare(password, user.Password);

      if (!passwordMatch) {
        return res.status(401).json({ error: "Password Not Match" });
      }

      // Generate a JWT token
      const token = jwt.sign({ userId: user.UserID }, SECRET_KEY, {
        expiresIn: "1h", // Set the token expiration time as needed
      });

      // Send the token to the client
      res.status(200).json({ token });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/api/users/:userID", authenticateUser, async (req, res) => {
  // Update user information endpoint code
  // Modify this section to update user information in the database
});

router.delete("/api/users/:userID", authenticateUser, async (req, res) => {
  // Delete user endpoint code
  // Modify this section to delete a user from the database
});

router.get("/api/check", (req, res) => {
  res.json({ message: "Hello from server!2" });
});

router.get('/accessResource', authenticateUser, (req, res)=>{  
  
  res.status(200).json({success:true, data:{userId:req.userId, email:req.email}});   
})

module.exports = router;
