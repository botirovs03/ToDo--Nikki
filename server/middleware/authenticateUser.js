// middleware/authenticateUser.js
const jwt = require("jsonwebtoken");
const SECRET_KEY = "your_secret_key_here";

function authenticateUser(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  //Authorization: 'Bearer TOKEN'
  if (!token) {
    res
      .status(200)
      .json({ success: false, message: "Error! Token was not provided." });
  }
  //Decoding the token

  try {
    const decodedToken = jwt.verify(token, SECRET_KEY);
    req.userId = decodedToken.userId; // Make userId available in subsequent middleware or routes
    next(); // Move on to the next middleware or route handler
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Unauthorized" });
  }
}

module.exports = authenticateUser;
