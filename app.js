// app.js
require('dotenv').config(); // <--- THIS MUST BE THE ABSOLUTE FIRST LINE OF THE FILE!

console.log('DEBUG: process.env.SESSION_SECRET =', process.env.SESSION_SECRET); // Add this line for debugging
console.log('DEBUG: process.env.DB_URL =', process.env.DB_URL); // Add this line for debugging

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// --- IMPORTANT: Require your Mongoose models ---
const userModel = require('./models/user'); // Ensure this path is correct
const postModel = require('./models/post'); // Ensure this path is correct

// --- Multer config for file uploads ---
const upload = require('./config/multer'); // Ensure this path is correct

// --- Server Setup ---
const app = express();
const PORT = parseInt(process.env.PORT, 10) || 3000; // Define PORT constant

// --- MongoDB Connection ---
// Ensure process.env.DB_URL is correctly loaded from your .env file
mongoose.connect(process.env.DB_URL, {
  // useUnifiedTopology is deprecated in Mongoose 6+, but keeping it doesn't hurt for now.
  // useNewUrlParser is also deprecated. Mongoose 6+ handles these by default.
  // You can safely remove these options if you're on Mongoose 6+
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection failed', err));

// --- Middleware ---
app.use(express.json()); // To parse JSON request bodies
app.use(express.urlencoded({extended:true})); // To parse URL-encoded request bodies
app.use(cookieParser()); // To parse cookies
app.use(express.static(path.join(__dirname,'public'))); // To serve static files from 'public' folder

// --- EJS View Engine Setup ---
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views')); // Explicitly set views directory


// --- Middleware for Authentication Check ---
function islogged(req, res, next) {
    if (!req.cookies.token) {
        res.redirect('/login');
    } else {
        try {
            // Use process.env.SESSION_SECRET for JWT verification
            const data = jwt.verify(req.cookies.token, process.env.SESSION_SECRET);
            req.user = data; // Attach user data to request
            next();
        } catch (error) {
            console.error("JWT verification failed:", error.message);
            res.clearCookie('token'); // Clear invalid token
            res.redirect('/login');
        }
    }
}


// --- Routes ---

// Home/Signup Page
app.get('/', (req, res) => {
    res.render('index'); // Renders views/index.ejs (your signup page)
});

// Create User (Signup)
app.post('/create', async (req, res) => {
    var {name, username, email, age, password} = req.body;

    try {
        var user = await userModel.findOne({email});
        if (user) {
            return res.status(409).send('User with this email already exists.');
        }

        bcrypt.genSalt(10, async function(err, salt) {
            if (err) throw err;
            bcrypt.hash(password, salt, async function(err, hash) {
                if (err) throw err;

                const newUser = await userModel.create({
                    name,
                    username,
                    email,
                    age,
                    password: hash,
                    // profilepicture will default to "default.jpg" if not provided
                    // posts will default to [] if not provided
                });

                // Use process.env.SESSION_SECRET for JWT signing
                var token = jwt.sign({ email: newUser.email, id: newUser._id }, process.env.SESSION_SECRET); // Include user ID in token
                res.cookie('token', token);
                res.redirect('/profile');
            });
        });
    } catch (error) {
        console.error("Error during user creation:", error);
        res.status(500).send("Something went wrong during account creation.");
    }
});

// Logout
app.get('/logout', (req, res) => {
    res.clearCookie("token"); // Clear the token cookie
    res.redirect('/login');
});

// Login Page
app.get('/login', (req, res) => {
    res.render('login'); // Renders views/login.ejs
});

// User Login
app.post('/login', async (req, res) => {
    var {email, password} = req.body;
    try {
        var user = await userModel.findOne({email});
        if (!user) {
            return res.status(400).send('Invalid email or password!');
        }

        bcrypt.compare(password, user.password, function(err, result) {
            if (result) {
                // Use process.env.SESSION_SECRET for JWT signing
                var token = jwt.sign({ email: user.email, id: user._id }, process.env.SESSION_SECRET); // Include user ID in token
                res.cookie('token', token);
                res.redirect('/profile');
            } else {
                res.status(401).send("Invalid email or password!");
            }
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("An error occurred during login.");
    }
});

// User Profile Page
app.get('/profile', islogged, async (req, res) => {
    try {
        // req.user.email comes from the JWT payload
        const user = await userModel.findOne({email: req.user.email}).populate('posts');
        if (!user) {
            // User not found despite valid token - likely data mismatch
            res.clearCookie('token');
            return res.redirect('/login');
        }
        console.log("User object for profile:", user); // Log user object in backend console
        res.render('profile', {user}); // Renders views/profile.ejs
    } catch (error) {
        console.error("Error loading profile:", error);
        res.status(500).send("Failed to load profile data.");
    }
});

// Create Post
app.post('/post', islogged, async (req, res) => {
    try {
        const user = await userModel.findOne({email: req.user.email});
        if (!user) {
            return res.status(404).send("User not found.");
        }
        const post = await postModel.create({
            user: user._id,
            content: req.body.content,
        });
        user.posts.push(post._id); // Add post ID to user's posts array
        await user.save(); // Save the updated user document
        res.redirect('/profile');
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).send("Failed to create post.");
    }
});

// Like/Unlike Post
app.get('/like/:id', islogged, async (req, res) => {
    try {
        const user = await userModel.findOne({email: req.user.email});
        const post = await postModel.findOne({_id: req.params.id});

        if (!user || !post) {
            return res.status(404).send("User or Post not found.");
        }

        const likeIndex = post.likes.indexOf(user._id);
        if (likeIndex === -1) {
            post.likes.push(user._id); // User hasn't liked it, so add like
        } else {
            post.likes.splice(likeIndex, 1); // User has liked it, so remove like
        }
        await post.save();
        res.redirect('/profile');
    } catch (error) {
        console.error("Error liking/unliking post:", error);
        res.status(500).send("Failed to update like status.");
    }
});

// Edit Post Page
app.get('/edit/:id', islogged, async (req, res) => {
    try {
        const post = await postModel.findOne({_id: req.params.id});
        if (!post) {
            return res.status(404).send("Post not found.");
        }
        // Ensure only the owner can edit
        if (post.user.toString() !== req.user.id.toString()) { // Compare ObjectIds
            return res.status(403).send("You are not authorized to edit this post.");
        }
        res.render('edit', {post}); // Renders views/edit.ejs
    } catch (error) {
        console.error("Error loading edit page:", error);
        res.status(500).send("Failed to load post for editing.");
    }
});

// Update Post
app.post('/update/:id', islogged, async (req, res) => {
    try {
        const post = await postModel.findOne({_id: req.params.id});
        if (!post) {
            return res.status(404).send("Post not found.");
        }
        // Ensure only the owner can update
        if (post.user.toString() !== req.user.id.toString()) { // Compare ObjectIds
            return res.status(403).send("You are not authorized to update this post.");
        }
        var {content} = req.body;
        post.content = content;
        await post.save();
        res.redirect('/profile');
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).send("Failed to update post.");
    }
});

// Upload Profile Picture Page
app.get('/profile/upload', islogged, async (req, res) => {
    try {
        const user = await userModel.findOne({email: req.user.email});
        if (!user) {
            return res.status(404).send("User not found.");
        }
        res.render('task', {user}); // Renders views/task.ejs
    } catch (error) {
        console.error("Error loading upload page:", error);
        res.status(500).send("Failed to load upload page.");
    }
});

// Handle Profile Picture Upload
app.post('/upload', islogged, upload.single('bal'), async (req, res) => {
    try {
        const user = await userModel.findOne({email: req.user.email});
        if (!user) {
            return res.status(404).send("User not found.");
        }
        if (req.file) {
            user.profilepicture = req.file.filename;
            await user.save();
            res.redirect('/profile');
        } else {
            res.status(400).send("No file uploaded.");
        }
    } catch (error) {
        console.error("Error during file upload:", error);
        res.status(500).send("Failed to upload profile picture.");
    }
});

// --- Server Start ---
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
