const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key'; // Replace with your actual secret key

function authenticateUser(req, res, next) {
    // Get the token from the request headers
    const token = req.headers.authorization.split(' ')[1];

    // Check if the token is missing
    if(!token){
        console.error('Token is missing');
        return res.status(401).json({ message: 'Missing token' });
    }

    try {
        // Verify the token using the secret key
        const decodedToken = jwt.verify(token, SECRET_KEY );
        // Attach the decoded payload to the request object for further use
        req.userId = decodedToken.userId;

        console.log(req.userId);
        // Continue to the next middleware or route handler
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports = authenticateUser;
