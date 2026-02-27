require('dotenv').config();

const express = require('express');
//const dotenv = require('dotenv');
const authRoutes=require('./routes/authRoutes');
const User = require("./models/User");
const connectDB = require('./config/db');
const paymentRoutes = require('./routes/paymentRoutes');

// dotenv.config({ path: './.env' });

connectDB();

// CREATE app instance (this was missing)
const app = express();

// middleware to read json data from requests
app.use(express.json());

//Routes
app.use('/api/auth',authRoutes);

app.use('/api/payment', paymentRoutes); ////i added this line

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send("Server is up and running!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});