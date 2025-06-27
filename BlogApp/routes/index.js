const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middleware/auth');
const Post = require('../models/Post');

// Home page
router.get('/', optionalAuth, async (req, res) => {
    try {
        const posts = await Post.find({ status: 'published' })
            .populate('author', 'username avatar')
            .sort({ createdAt: -1 })
            .limit(10);

        res.render('index', {
            title: 'Blog Home',
            posts,
            user: req.user
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.render('index', {
            title: 'Blog Home',
            posts: [],
            user: req.user,
            error: 'Failed to load posts'
        });
    }
});

// Dashboard (requires authentication)
router.get('/dashboard', require('../middleware/auth').requireAuth, async (req, res) => {
    try {
        const userPosts = await Post.find({ author: req.user._id })
            .sort({ createdAt: -1 })
            .limit(5);

        const recentPosts = await Post.find({ status: 'published' })
            .populate('author', 'username')
            .sort({ createdAt: -1 })
            .limit(3);

        res.render('dashboard', {
            title: 'Dashboard',
            user: req.user,
            userPosts,
            recentPosts
        });
    } catch (error) {
        console.error('Error loading dashboard:', error);
        res.render('dashboard', {
            title: 'Dashboard',
            user: req.user,
            userPosts: [],
            recentPosts: [],
            error: 'Failed to load dashboard data'
        });
    }
});

// About page
router.get('/about', optionalAuth, (req, res) => {
    res.render('about', {
        title: 'About',
        user: req.user
    });
});

// Contact page
router.get('/contact', optionalAuth, (req, res) => {
    res.render('contact', {
        title: 'Contact',
        user: req.user
    });
});

module.exports = router; 