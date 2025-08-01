const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmanager', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Import routes and middleware
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const categoryRoutes = require('./routes/categories');
const { authenticateToken } = require('./middleware/auth');

// Middleware to extract user data for views
app.use(async (req, res, next) => {
    try {
        const token = req.cookies.token;
        console.log('Token found:', !!token);
        console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');
        if (token) {
            const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
            const decoded = jwt.verify(token, jwtSecret);
            console.log('Token decoded:', decoded);
            const User = require('./models/User');
            const user = await User.findById(decoded.userId).select('-password');
            req.user = user;
            console.log('User loaded:', user ? user.username : 'null');
        } else {
            req.user = null;
            console.log('No token found');
        }
    } catch (error) {
        // Token is invalid or expired
        req.user = null;
        console.log('Token error:', error.message);
    }
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/categories', categoryRoutes);

// Basic routes
app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('login', { user: req.user });
});

app.get('/register', (req, res) => {
    res.render('register', { user: req.user });
});

app.get('/dashboard', (req, res) => {
    res.render('dashboard', { user: req.user });
});

app.get('/profile', (req, res) => {
    res.render('profile', { user: req.user });
});

app.get('/auth-test', (req, res) => {
    res.render('auth-test');
});

// Debug route to check user data
app.get('/debug', (req, res) => {
    res.json({
        user: req.user,
        cookies: req.cookies,
        hasToken: !!req.cookies.token
    });
});

// Task management routes
app.get('/tasks', (req, res) => {
    res.render('taskList', { user: req.user });
});

app.get('/tasks/new', (req, res) => {
    res.render('taskForm', { user: req.user });
});

app.get('/tasks/:id/edit', (req, res) => {
    res.render('taskForm', { user: req.user });
});

app.get('/tasks/all', (req, res) => {
    res.render('taskList', { showAllTasks: true, user: req.user });
});

// Category management routes
app.get('/categories', (req, res) => {
    res.render('categoryList', { user: req.user });
});

app.get('/categories/new', (req, res) => {
    res.render('categoryForm', { user: req.user });
});

app.get('/categories/:id/edit', (req, res) => {
    res.render('categoryForm', { user: req.user });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 