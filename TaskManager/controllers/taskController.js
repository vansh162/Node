const Task = require('../models/Task');
const Category = require('../models/Category');
const { validationResult } = require('express-validator');

// Get all tasks for authenticated user
const getUserTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ 
            user: req.user.userId,
            isActive: true 
        })
        .populate('category', 'name color')
        .sort({ createdAt: -1 });

        res.json({
            success: true,
            tasks: tasks
        });

    } catch (error) {
        console.error('Get user tasks error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get all tasks (admin only)
const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ isActive: true })
            .populate('user', 'username email')
            .populate('category', 'name color')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            tasks: tasks
        });

    } catch (error) {
        console.error('Get all tasks error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get single task
const getTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('category', 'name color')
            .populate('user', 'username email');

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Check if user can access this task
        if (req.user.role !== 'admin' && task.user.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        res.json({
            success: true,
            task: task
        });

    } catch (error) {
        console.error('Get task error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Create new task
const createTask = async (req, res) => {
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

        const { title, description, status, priority, dueDate, categoryId, tags } = req.body;

        // Create task data
        const taskData = {
            title,
            description,
            status: status || 'pending',
            priority: priority || 'medium',
            user: req.user.userId,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : []
        };

        // Add due date if provided
        if (dueDate) {
            taskData.dueDate = new Date(dueDate);
        }

        // Add category if provided
        if (categoryId) {
            // Verify category belongs to user
            const category = await Category.findOne({ 
                _id: categoryId, 
                user: req.user.userId 
            });
            
            if (category) {
                taskData.category = categoryId;
            }
        }

        const task = new Task(taskData);
        await task.save();

        // Populate category and user info
        await task.populate('category', 'name color');
        await task.populate('user', 'username');

        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            task: task
        });

    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Update task
const updateTask = async (req, res) => {
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

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Check if user can update this task
        if (req.user.role !== 'admin' && task.user.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        const { title, description, status, priority, dueDate, categoryId, tags } = req.body;

        // Update task fields
        if (title) task.title = title;
        if (description !== undefined) task.description = description;
        if (status) task.status = status;
        if (priority) task.priority = priority;
        if (dueDate) task.dueDate = new Date(dueDate);
        if (tags) task.tags = tags.split(',').map(tag => tag.trim());

        // Handle completion
        if (status === 'completed' && task.status !== 'completed') {
            task.completedAt = new Date();
        } else if (status !== 'completed') {
            task.completedAt = null;
        }

        // Update category if provided
        if (categoryId) {
            // Verify category belongs to user (unless admin)
            const category = await Category.findOne({ 
                _id: categoryId, 
                user: req.user.role === 'admin' ? { $exists: true } : req.user.userId 
            });
            
            if (category) {
                task.category = categoryId;
            }
        }

        await task.save();

        // Populate category and user info
        await task.populate('category', 'name color');
        await task.populate('user', 'username');

        res.json({
            success: true,
            message: 'Task updated successfully',
            task: task
        });

    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Delete task
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Check if user can delete this task
        if (req.user.role !== 'admin' && task.user.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Soft delete
        task.isActive = false;
        await task.save();

        res.json({
            success: true,
            message: 'Task deleted successfully'
        });

    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get task statistics
const getTaskStats = async (req, res) => {
    try {
        const userId = req.user.role === 'admin' ? {} : { user: req.user.userId };
        
        const stats = await Task.aggregate([
            { $match: { ...userId, isActive: true } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const priorityStats = await Task.aggregate([
            { $match: { ...userId, isActive: true } },
            {
                $group: {
                    _id: '$priority',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            success: true,
            stats: {
                status: stats,
                priority: priorityStats
            }
        });

    } catch (error) {
        console.error('Get task stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    getUserTasks,
    getAllTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    getTaskStats
}; 