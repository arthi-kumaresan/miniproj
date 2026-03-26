// Role-based access control middleware
// Viewer → only GET requests
// Auditor → GET + audit remarks
// Staff → upload + edit documents
// Admin → full access

const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        // Admin always has full access
        if (req.user.role === 'Admin') {
            return next();
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Access denied. Your role (${req.user.role}) does not have permission for this action.`
            });
        }

        next();
    };
};

// Viewer can only make GET requests
const viewerRestriction = (req, res, next) => {
    if (req.user.role === 'Viewer' && req.method !== 'GET') {
        return res.status(403).json({
            message: 'Viewers can only view data. Contact admin for write access.'
        });
    }
    next();
};

module.exports = { roleMiddleware, viewerRestriction };
