const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { validateCategory } = require('../middleware/validation');

// Get user's own categories
router.get('/my-categories', authenticateToken, categoryController.getUserCategories);

// Get all categories (admin only)
router.get('/all-categories', authenticateToken, authorizeRole('admin'), categoryController.getAllCategories);

// Get single category
router.get('/:id', authenticateToken, categoryController.getCategory);

// Create new category
router.post('/', authenticateToken, validateCategory, categoryController.createCategory);

// Update category
router.put('/:id', authenticateToken, validateCategory, categoryController.updateCategory);

// Delete category
router.delete('/:id', authenticateToken, categoryController.deleteCategory);

module.exports = router; 