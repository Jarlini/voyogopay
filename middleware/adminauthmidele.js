const adminAuth = (req, res, next) => {
    // Assuming the user object is attached by the authentication middleware
    if (req.user && req.user.role === 'admin') {
        next(); // Proceed if user is an admin
    } else {
        res.status(403).json({ message: 'Access denied' }); // Deny access otherwise
    }
};

module.exports = adminAuth;
