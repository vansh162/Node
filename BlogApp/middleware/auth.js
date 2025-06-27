const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to check if user is authenticated
const requireAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.redirect('/auth/login');
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            res.clearCookie('token');
            return res.redirect('/auth/login');
        }

        req.user = user;
        next();
    } catch (error) {
        res.clearCookie('token');
        res.redirect('/auth/login');
    }
};

// Middleware to check if user is admin
const requireAdmin = async (req, res, next) => {
    try {
        await requireAuth(req, res, () => {
            if (!req.user.isAdmin) {
                return res.status(403).render('error', { error: 'Access denied. Admin privileges required.' });
            }
            next();
        });
    } catch (error) {
        res.redirect('/auth/login');
    }
};

// Optional auth middleware (doesn't redirect, just sets user if available)
const optionalAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        
        if (token) {
            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await User.findById(decoded.userId);
            if (user) {
                req.user = user;
            }
        }
        next();
    } catch (error) {
        next();
    }
};

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

module.exports = {
    requireAuth,
    requireAdmin,
    optionalAuth,
    generateToken
}; 