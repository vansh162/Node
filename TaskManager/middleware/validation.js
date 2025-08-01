const { body } = require('express-validator');

// Registration validation
const validateRegister = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
    body('role')
        .optional()
        .isIn(['user', 'admin'])
        .withMessage('Role must be either "user" or "admin"')
];

// Login validation
const validateLogin = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

// Profile update validation
const validateProfileUpdate = [
    body('username')
        .optional()
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    
    body('email')
        .optional()
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    
    body('currentPassword')
        .optional()
        .notEmpty()
        .withMessage('Current password is required for password changes'),
    
    body('newPassword')
        .optional()
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number')
];

// Password change validation
const validatePasswordChange = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number')
];

// Task validation
const validateTask = [
    body('title')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Task title must be between 3 and 100 characters'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description must be less than 500 characters'),
    
    body('status')
        .optional()
        .isIn(['pending', 'in-progress', 'completed', 'cancelled'])
        .withMessage('Status must be pending, in-progress, completed, or cancelled'),
    
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high', 'urgent'])
        .withMessage('Priority must be low, medium, high, or urgent'),
    
    body('dueDate')
        .optional()
        .custom((value) => {
            if (!value) return true; // Allow empty
            const date = new Date(value);
            return !isNaN(date.getTime());
        })
        .withMessage('Due date must be a valid date'),
    
    body('categoryId')
        .optional()
        .custom((value) => {
            if (!value || value === '') return true; // Allow empty
            return /^[0-9a-fA-F]{24}$/.test(value);
        })
        .withMessage('Category ID must be a valid MongoDB ID'),
    
    body('tags')
        .optional()
        .custom((value) => {
            if (!value) return true; // Allow empty
            return typeof value === 'string';
        })
        .withMessage('Tags must be a comma-separated string')
];

// Category validation
const validateCategory = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Category name must be between 2 and 50 characters'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Description must be less than 200 characters'),
    
    body('color')
        .optional()
        .matches(/^#[0-9A-F]{6}$/i)
        .withMessage('Color must be a valid hex color (e.g., #007bff)')
];

module.exports = {
    validateRegister,
    validateLogin,
    validateProfileUpdate,
    validatePasswordChange,
    validateTask,
    validateCategory
}; 