const express = require('express');
const UserModal = require('../modals/userModal');
const userRoute = express.Router();

userRoute.get('/', (req, res) => {
    res.send('User route is working!');
});

userRoute.post('/register',async (req, res) => {
    const { name, email, password } = req.body;
    // Here you would typically save the user to the database
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    // For now, we will just return a success message
await UserModal.create({ name, email, password });

    res.status(201).json({ message: 'User registered successfully', user: { name, email } });
});
module.exports = userRoute;