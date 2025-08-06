// // backend/middleware/adminMiddleware.js

// const admin = (req, res, next) => {
//   // We check the role attached by the authMiddleware (Step 2)
//   if (req.user && req.user.role === 'admin') {
//     next(); // User is an admin, proceed to the route
//   } else {
//     // User is not authorized
//     res.status(403).json({ msg: 'Not authorized as an admin' });
//   }
// };

// module.exports = { admin };


const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ msg: 'Not authorized as an admin' });
  }
};

module.exports = { admin };