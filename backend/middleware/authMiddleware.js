// middleware/authMiddleware.js
// Protects routes by verifying the JWT token sent in the request header.

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Check if the Authorization header exists and starts with "Bearer "
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Header looks like: "Bearer eyJhbGciOi..."
      // Splitting by space and taking the second part gives us just the token
      token = req.headers.authorization.split(" ")[1];

      // Verify the token's signature using our secret key
      // If tampered with or expired, this throws an error automatically
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // decoded.id was embedded when we created the token in generateToken()
      // Fetch the user from DB (excluding password) and attach to req.user
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User no longer exists" });
      }

      // Everything checks out — pass control to the next function (the actual controller)
      next();
    } catch (error) {
      console.error("Auth Middleware Error:", error.message);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

module.exports = { protect };