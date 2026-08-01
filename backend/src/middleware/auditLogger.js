const { AuditLog } = require('../models');

/**
 * Audit Logger Middleware
 * Logs all mutation operations (POST, PUT, DELETE) to the audit_logs table
 */
const auditLogger = (entity) => {
  return async (req, res, next) => {
    // Only log mutations
    if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      return next();
    }

    // Store original json method to intercept response
    const originalJson = res.json.bind(res);

    res.json = async (body) => {
      try {
        // Only log successful operations
        if (body && body.success) {
          await AuditLog.create({
            user_id: req.user ? req.user.id : null,
            action: req.method,
            entity: entity,
            entity_id: req.params.id || (body.data && body.data.id) || null,
            old_values: req.method === 'PUT' || req.method === 'PATCH' ? req._oldValues || null : null,
            new_values: req.method !== 'DELETE' ? req.body : null,
            ip_address: req.ip || req.connection.remoteAddress
          });
        }
      } catch (error) {
        console.error('Audit log error:', error.message);
      }

      return originalJson(body);
    };

    next();
  };
};

module.exports = { auditLogger };
