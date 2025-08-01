const Category = require('../models/Category');
const { validationResult } = require('express-validator');

// Get all categories for authenticated user
const getUserCategories = async (req, res) => {
    try {
        const Task = require('../models/Task');
        
        const categories = await Category.find({ 
            user: req.user.userId,
            isActive: true 
        }).sort({ name: 1 });

        // Add task count for each category
        const categoriesWithTaskCount = await Promise.all(
            categories.map(async (category) => {
                const taskCount = await Task.countDocuments({
                    category: category._id,
                    user: req.user.userId,
                    isActive: true
                });
                
                return {
                    ...category.toObject(),
                    taskCount: taskCount
                };
            })
        );

        res.json({
            success: true,
            categories: categoriesWithTaskCount
        });

    } catch (error) {
        console.error('Get user categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get all categories (admin only)
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true })
            .populate('user', 'username email')
            .sort({ name: 1 });

        res.json({
            success: true,
            categories: categories
        });

    } catch (error) {
        console.error('Get all categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get single category
const getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)
            .populate('user', 'username email');

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Check if user can access this category
        if (req.user.role !== 'admin' && category.user.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        res.json({
            success: true,
            category: category
        });

    } catch (error) {
        console.error('Get category error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Create new category
const createCategory = async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { name, description, color } = req.body;

        // Check if category name already exists for this user
        const existingCategory = await Category.findOne({
            name: name,
            user: req.user.userId,
            isActive: true
        });

        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Category with this name already exists'
            });
        }

        const category = new Category({
            name,
            description,
            color: color || '#007bff',
            user: req.user.userId
        });

        await category.save();

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            category: category
        });

    } catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Update category
const updateCategory = async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Check if user can update this category
        if (req.user.role !== 'admin' && category.user.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        const { name, description, color } = req.body;

        // Check if new name conflicts with existing category (for same user)
        if (name && name !== category.name) {
            const existingCategory = await Category.findOne({
                name: name,
                user: category.user,
                isActive: true,
                _id: { $ne: category._id }
            });

            if (existingCategory) {
                return res.status(400).json({
                    success: false,
                    message: 'Category with this name already exists'
                });
            }
        }

        // Update category fields
        if (name) category.name = name;
        if (description !== undefined) category.description = description;
        if (color) category.color = color;

        await category.save();

        res.json({
            success: true,
            message: 'Category updated successfully',
            category: category
        });

    } catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Delete category
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Check if user can delete this category
        if (req.user.role !== 'admin' && category.user.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Soft delete
        category.isActive = false;
        await category.save();

        res.json({
            success: true,
            message: 'Category deleted successfully'
        });

    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    getUserCategories,
    getAllCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
}; 