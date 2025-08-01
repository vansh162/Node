const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { validateTask } = require('../middleware/validation');

// Get user's own tasks
router.get('/my-tasks', authenticateToken, taskController.getUserTasks);

// Get all tasks (admin only)
router.get('/all-tasks', authenticateToken, authorizeRole('admin'), taskController.getAllTasks);

// Get single task
router.get('/:id', authenticateToken, taskController.getTask);

// Create new task
router.post('/', authenticateToken, validateTask, taskController.createTask);

// Update task
router.put('/:id', authenticateToken, validateTask, taskController.updateTask);

// Delete task
router.delete('/:id', authenticateToken, taskController.deleteTask);

// Get task statistics
router.get('/stats/overview', authenticateToken, taskController.getTaskStats);

module.exports = router; 