const express = require('express');
const connection = require('./config/db');
const userRoute = require('./routes/userRoute');
const app = express();
require('dotenv').config();


app.use(express.json());
app.use('/api/users', userRoute);

app.listen(process.env.PORT, (error) => {
    if(error){
        console.error('Error starting the server:', error);
        return;
    }
    connection()
    console.log('Server is running ', process.env.PORT);
});