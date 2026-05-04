/**
 * Role-Based Access Control Middleware
 * Usage: authorize('admin', 'teamleader')
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: `Access denied. Requires role: [${roles.join(', ')}].`
            });
        }
        next();
    };
};

module.exports = { authorize };
