/**
 * @desc    Authentication middleware for a session-based system (like Passport.js).
 *          It protects routes by checking if a user is currently logged in.
 * @param   {Object} req - The Express request object.
 * @param   {Object} res - The Express response object.
 * @param   {Function} next - The next middleware function in the stack.
 */
const authMiddleware = (req, res, next) => {
  // Passport.js automatically attaches the 'user' object to the request (req.user)
  // upon successful login. It also provides the isAuthenticated() method.
  // We check if this method returns true.
  if (req.isAuthenticated()) {
    // If the user is authenticated, the request is valid.
    // We call next() to pass control to the next handler in the chain (e.g., your controller).
    return next();
  }

  // If req.isAuthenticated() is false, it means the user is not logged in.
  // We send a 401 Unauthorized status and an error message.
  // This prevents any further processing of the request for this route.
  res.status(401).json({ message: 'Unauthorized: You must be logged in to access this resource.' });
};

module.exports = authMiddleware;