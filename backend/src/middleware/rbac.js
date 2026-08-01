/**
 * Role-Based Access Control Middleware
 * Checks if the authenticated user has one of the allowed roles
 * @param  {...string} roles - Allowed roles (e.g., 'Admin', 'Faculty', 'Student')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role(s): ${roles.join(', ')}`
      });
    }

    next();
  };
};

module.exports = { authorize };
