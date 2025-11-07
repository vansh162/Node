const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to check if user is authenticated
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/auth/login');
    }

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) {
            res.clearCookie('token');
            return res.redirect('/auth/login');
        }

        try {
            const user = await User.findById(decoded.userId).select('-password');
            if (!user) {
                res.clearCookie('token');
                return res.redirect('/auth/login');
            }

            req.user = user;
            next();
        } catch (error) {
            res.clearCookie('token');
            return res.redirect('/auth/login');
        }
    });
};

// Middleware to check if user has admin role
const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).render('error', { 
            error: 'Access denied. Admin privileges required.' 
        });
    }
    next();
};

// Middleware to check if user is the author of the article
const requireAuthor = async (req, res, next) => {
    try {
        const Article = require('../models/Article');
        const article = await Article.findById(req.params.id);
        
        if (!article) {
            return res.status(404).render('error', { error: 'Article not found' });
        }

        if (article.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).render('error', { 
                error: 'Access denied. You can only edit your own articles.' 
            });
        }

        req.article = article;
        next();
    } catch (error) {
        res.status(500).render('error', { error: 'Server error' });
    }
};

// Optional authentication middleware (doesn't redirect)
const optionalAuth = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return next();
    }

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) {
            res.clearCookie('token');
            return next();
        }

        try {
            const user = await User.findById(decoded.userId).select('-password');
            if (user) {
                req.user = user;
            }
            next();
        } catch (error) {
            res.clearCookie('token');
            next();
        }
    });
};

module.exports = {
    authenticateToken,
    requireAdmin,
    requireAuthor,
    optionalAuth,
    JWT_SECRET
}; 