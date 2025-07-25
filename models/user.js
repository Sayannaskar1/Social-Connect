const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 30,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/,
        index: true
    },
    age: {
        type: Number,
        min: 0,
        max: 120
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'post' // Reference to the 'post' model
        }
    ],
    default: [] // <--- CORRECT PLACEMENT: This 'default' applies to the 'posts' array itself
    , // <--- REMOVED: No comma needed here if 'profilepicture' follows directly
    profilepicture: {
        type: String,
        default: "default.jpg"
    }
}, {
    timestamps: true // This automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('user', userSchema); // Ensure 'user' matches the model name used in mongoose.model()
