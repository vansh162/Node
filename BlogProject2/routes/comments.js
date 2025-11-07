const express = require('express');
const Comment = require('../models/Comment');
const Article = require('../models/Article');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Add comment to article
router.post('/:articleId', authenticateToken, async (req, res) => {
    try {
        const { content } = req.body;
        const articleId = req.params.articleId;

        // Check if article exists
        const article = await Article.findById(articleId);
        if (!article) {
            return res.status(404).render('error', { error: 'Article not found' });
        }

        // Create new comment
        const comment = new Comment({
            content,
            author: req.user._id,
            article: articleId
        });

        await comment.save();
        res.redirect(`/articles/${articleId}`);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).render('error', { error: 'Failed to add comment' });
    }
});

// Delete comment (only author or admin can delete)
router.post('/:commentId/delete', authenticateToken, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        
        if (!comment) {
            return res.status(404).render('error', { error: 'Comment not found' });
        }

        // Check if user is author of comment or admin
        if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).render('error', { 
                error: 'You can only delete your own comments' 
            });
        }

        await Comment.findByIdAndDelete(req.params.commentId);
        res.redirect(`/articles/${comment.article}`);
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).render('error', { error: 'Failed to delete comment' });
    }
});

module.exports = router; 