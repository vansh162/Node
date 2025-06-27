const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { requireAuth, optionalAuth } = require('../middleware/auth');

// Create post form (requires auth) - MUST come before /:id route
router.get('/create', requireAuth, (req, res) => {
    res.render('blog/create', {
        title: 'Create New Post',
        user: req.user
    });
});

// Create post (requires auth) - MUST come before /:id route
router.post('/', requireAuth, async (req, res) => {
    try {
        const { title, content, tags, status } = req.body;

        if (!title || !content) {
            return res.render('blog/create', {
                title: 'Create New Post',
                user: req.user,
                error: 'Title and content are required'
            });
        }

        const post = new Post({
            title,
            content,
            author: req.user._id,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            status: status || 'published'
        });

        await post.save();
        res.redirect(`/blog/${post._id}`);
    } catch (error) {
        console.error('Error creating post:', error);
        res.render('blog/create', {
            title: 'Create New Post',
            user: req.user,
            error: 'Failed to create post'
        });
    }
});

// Show all posts
router.get('/', optionalAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 6;
        const skip = (page - 1) * limit;

        const posts = await Post.find({ status: 'published' })
            .populate('author', 'username avatar')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalPosts = await Post.countDocuments({ status: 'published' });
        const totalPages = Math.ceil(totalPosts / limit);

        res.render('blog/index', {
            title: 'Blog Posts',
            posts,
            user: req.user,
            currentPage: page,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.render('blog/index', {
            title: 'Blog Posts',
            posts: [],
            user: req.user,
            error: 'Failed to load posts'
        });
    }
});

// Edit post form (requires auth and ownership) - MUST come before /:id route
router.get('/:id/edit', requireAuth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).render('error', { 
                error: 'Post not found',
                user: req.user
            });
        }

        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).render('error', { 
                error: 'Access denied',
                user: req.user
            });
        }

        res.render('blog/edit', {
            title: 'Edit Post',
            post,
            user: req.user
        });
    } catch (error) {
        console.error('Error fetching post for edit:', error);
        res.status(404).render('error', { 
            error: 'Post not found',
            user: req.user
        });
    }
});

// Add comment (requires auth) - MUST come before /:id route
router.post('/:id/comments', requireAuth, async (req, res) => {
    try {
        const { content } = req.body;
        
        if (!content || content.trim().length === 0) {
            return res.redirect(`/blog/${req.params.id}`);
        }

        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).render('error', { 
                error: 'Post not found',
                user: req.user
            });
        }

        post.comments.push({
            user: req.user._id,
            content: content.trim()
        });

        await post.save();
        res.redirect(`/blog/${req.params.id}`);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.redirect(`/blog/${req.params.id}`);
    }
});

// Like/Unlike post (requires auth) - MUST come before /:id route
router.post('/:id/like', requireAuth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const likeIndex = post.likes.indexOf(req.user._id);
        
        if (likeIndex > -1) {
            // Unlike
            post.likes.splice(likeIndex, 1);
        } else {
            // Like
            post.likes.push(req.user._id);
        }

        await post.save();
        res.json({ 
            success: true, 
            likeCount: post.likes.length,
            isLiked: likeIndex === -1
        });
    } catch (error) {
        console.error('Error toggling like:', error);
        res.status(500).json({ error: 'Failed to toggle like' });
    }
});

// Show single post - MUST come after all other specific routes
router.get('/:id', optionalAuth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username avatar bio')
            .populate('comments.user', 'username avatar');

        if (!post || post.status !== 'published') {
            return res.status(404).render('error', { 
                error: 'Post not found',
                user: req.user
            });
        }

        // Increment view count
        post.views += 1;
        await post.save();

        res.render('blog/show', {
            title: post.title,
            post,
            user: req.user
        });
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(404).render('error', { 
            error: 'Post not found',
            user: req.user
        });
    }
});

// Update post (requires auth and ownership)
router.put('/:id', requireAuth, async (req, res) => {
    try {
        const { title, content, tags, status } = req.body;
        
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).render('error', { 
                error: 'Post not found',
                user: req.user
            });
        }

        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).render('error', { 
                error: 'Access denied',
                user: req.user
            });
        }

        post.title = title;
        post.content = content;
        post.tags = tags ? tags.split(',').map(tag => tag.trim()) : [];
        post.status = status || 'published';

        await post.save();
        res.redirect(`/blog/${post._id}`);
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).render('error', { 
            error: 'Failed to update post',
            user: req.user
        });
    }
});

// Delete post (requires auth and ownership)
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Access denied' });
        }

        await Post.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Failed to delete post' });
    }
});

module.exports = router; 