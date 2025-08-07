// // backend/middleware/authMiddleware.js

// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const protect = async (req, res, next) => {
//   let token;

//   // Check if the request has a valid Authorization header with a Bearer token
//   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     try {
//       // Get token from header (format: "Bearer TOKEN")
//       token = req.headers.authorization.split(' ')[1];

//       // Verify the token using the JWT_SECRET from your .env
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       // Fetch the user from the database and attach it to the request object
//       // We exclude the password from the fetched user
//       req.user = await User.findById(decoded.user.id).select('-password');
      
//       // We also attach the user's role to the request for easy access
//       req.userRole = decoded.user.role;

//       next(); // Proceed to the next middleware or route handler
//     } catch (error) {
//       console.error('Auth middleware error:', error);
//       return res.status(401).json({ msg: 'Not authorized, token failed' });
//     }
//   }

//   if (!token) {
//     return res.status(401).json({ msg: 'Not authorized, no token' });
//   }
// };

// module.exports = { protect };

// backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check if the Authorization header exists and starts with "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get the token from the header (e.g., "Bearer eyJhbGciOiJI...")
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using your JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by the ID from the token's payload
      // .select('-password') ensures the hashed password is not included
      req.user = await User.findById(decoded.user.id).select('-password');

      // If user is found, proceed to the next function in the chain (e.g., the admin middleware or the controller)
      if (req.user) {
        next();
      } else {
        res.status(401).json({ msg: 'Not authorized, user not found' });
      }
    } catch (error) {
      console.error('Token verification failed:', error.message);
      res.status(401).json({ msg: 'Not authorized, token failed' });
    }
  }

  // If no token was found in the header at all
  if (!token) {
    res.status(401).json({ msg: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };