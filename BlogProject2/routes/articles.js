const express = require('express');
const Article = require('../models/Article');
const Comment = require('../models/Comment');
const { authenticateToken, optionalAuth, requireAuthor } = require('../middleware/auth');

const router = express.Router();

// Get all articles (with optional auth for navbar)
router.get('/', optionalAuth, async (req, res) => {
    try {
        const articles = await Article.find({ isPublished: true })
            .populate('author', 'username')
            .sort({ createdAt: -1 });

        res.render('articleList', { 
            articles, 
            user: req.user || null 
        });
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).render('error', { error: 'Failed to load articles' });
    }
});

// Get user's own articles
router.get('/my-articles', authenticateToken, async (req, res) => {
    try {
        const articles = await Article.find({ author: req.user._id })
            .populate('author', 'username')
            .sort({ createdAt: -1 });

        res.render('myArticles', { 
            articles, 
            user: req.user 
        });
    } catch (error) {
        console.error('Error fetching user articles:', error);
        res.status(500).render('error', { error: 'Failed to load your articles' });
    }
});

// Show article form
router.get('/new', authenticateToken, (req, res) => {
    res.render('articleForm', { 
        article: null, 
        user: req.user 
    });
});

// Create new article
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        
        const article = new Article({
            title,
            content,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            author: req.user._id
        });

        await article.save();
        res.redirect('/articles');
    } catch (error) {
        console.error('Error creating article:', error);
        res.render('articleForm', { 
            article: req.body, 
            user: req.user,
            error: 'Failed to create article. Please try again.' 
        });
    }
});

// Show single article with comments
router.get('/:id', optionalAuth, async (req, res) => {
    try {
        const article = await Article.findById(req.params.id)
            .populate('author', 'username')
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: 'username'
                }
            });

        if (!article) {
            return res.status(404).render('error', { error: 'Article not found' });
        }

        // Get comments for this article
        const comments = await Comment.find({ article: req.params.id })
            .populate('author', 'username')
            .sort({ createdAt: -1 });

        res.render('articleItem', { 
            article, 
            comments, 
            user: req.user || null 
        });
    } catch (error) {
        console.error('Error fetching article:', error);
        res.status(500).render('error', { error: 'Failed to load article' });
    }
});

// Show edit form
router.get('/:id/edit', authenticateToken, requireAuthor, (req, res) => {
    res.render('articleForm', { 
        article: req.article, 
        user: req.user 
    });
});

// Update article
router.post('/:id', authenticateToken, requireAuthor, async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        
        req.article.title = title;
        req.article.content = content;
        req.article.tags = tags ? tags.split(',').map(tag => tag.trim()) : [];
        
        await req.article.save();
        res.redirect(`/articles/${req.params.id}`);
    } catch (error) {
        console.error('Error updating article:', error);
        res.render('articleForm', { 
            article: req.body, 
            user: req.user,
            error: 'Failed to update article. Please try again.' 
        });
    }
});

// Delete article
router.post('/:id/delete', authenticateToken, requireAuthor, async (req, res) => {
    try {
        await Article.findByIdAndDelete(req.params.id);
        await Comment.deleteMany({ article: req.params.id });
        res.redirect('/articles/my-articles');
    } catch (error) {
        console.error('Error deleting article:', error);
        res.status(500).render('error', { error: 'Failed to delete article' });
    }
});

module.exports = router; 