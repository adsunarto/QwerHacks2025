// Load environment variables
require('dotenv').config();

const express = require('express');
// MongoDB connection
const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

// MongoDB URI from .env file
const uri = process.env.MONGODB_URI;

const app = express();
app.use(express.json());
app.use(cors());

// Middleware to parse incoming request bodies (for form submissions)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(uri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error connecting to MongoDB:', err));

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: false },
    password: { type: String, required: true }  // Store the password as plaintext
});
const User = mongoose.model('users', userSchema);

// Route Schema
const routeSchema = new mongoose.Schema({
    username: String,
    from: String,
    to: String
});
const Route = mongoose.model('scheduled-routes', routeSchema);

// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;  // Get the username and password from the request body
    console.log(`Login attempt for username: ${username}`); // Only log the username for security reasons

    try {
        // Find the user by username (case-sensitive)
        const user = await User.findOne({ username: username.trim() });

        // If user doesn't exist
        if (!user) {
            console.log('User not found.');
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        // Compare the inputted password with the stored password (in plaintext)
        if (user.password === password) {
            // Password matches, proceed with login (could create a session or return a JWT)
            return res.status(200).json({
                success: true,
                message: 'Login successful',
                user: { 
                    username: user.username, 
                    email: user.email,
                    name: user.name // Send user name as well for the frontend
                }
            });
        } else {
            // Password doesn't match
            return res.status(401).json({ success: false, message: 'Incorrect password' });
        }

    } catch (error) {
        console.error('Login error:', error);  // More detailed error logging
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.get('/search', async (req, res) => {
    const { to } = req.query;  // Get the "to" location from query parameter
    console.log(`Searching for routes to ${to}.`);
    try {
        // Fetch routes from the MongoDB collection
        const routes = await Route.find({ to: to.trim() });  // Assuming you have a Route model

        if (routes.length > 0) {
            return res.status(200).json({ success: true, routes });
        } else {
            return res.status(200).json({ success: false, routes: [] });
        }
    } catch (error) {
        console.error('Error fetching routes:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


// Get routes by destination
app.post('/getRoutes', async (req, res) => {
    const { from, to } = req.body;

    const routes = await Route.find({ to });
    res.json(routes);
});

// Start server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
