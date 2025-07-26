// const mongoose = require('mongoose');


// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//         minlength: 2,
//         maxlength: 100
//     },
//     username: {
//         type: String,
//         required: true,
//         unique: true,
//         minlength: 3,
//         maxlength: 30,
//         index: true
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//         match: /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/,
//         index: true
//     },
//     age: {
//         type: Number,
//         min: 0,
//         max: 120
//     },
//     password: {
//         type: String,
//         required: true,
//         minlength: 6
//     },
//     posts: { // Define 'posts' as an object to hold its properties
//         type: [{ // This specifies that 'posts' is an array of ObjectIds
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'post' // Reference to the 'post' model
//         }],
//         default: [] // <--- CORRECT PLACEMENT: This 'default' applies to the 'posts' array field
//     }, // <--- Correct comma here, as 'posts' is a property of the main schema object
//     profilepicture: {
//         type: String,
//         default: "default.jpg"
//     }
// }, {
//     timestamps: true // This automatically adds createdAt and updatedAt fields
// });

// module.exports = mongoose.model('user', userSchema); // Ensure 'user' matches the model name used in mongoose.model()
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
        unique: true, // Ensures username is unique
        minlength: 3,
        maxlength: 30,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensures email is unique
        match: /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/, // Basic email regex validation
        index: true
    },
    age: {
        type: Number,
        min: 0, // Minimum age
        max: 120 // Maximum age
    },
    password: {
        type: String,
        required: true,
        minlength: 6 // Minimum password length
    },
    posts: { // Define 'posts' as an object to hold its properties
        type: [{ // This specifies that 'posts' is an array of ObjectIds
            type: mongoose.Schema.Types.ObjectId,
            ref: 'post' // Reference to the 'post' model
        }],
        default: [] // <--- CORRECT PLACEMENT: This 'default' applies to the 'posts' array field
    }, // Correct comma placement as 'posts' is a property of the main schema object
    profilepicture: {
        type: String,
        default: "default.jpg" // Default profile picture filename
    }
}, {
    timestamps: true // This automatically adds createdAt and updatedAt fields (createdAt, updatedAt)
});

module.exports = mongoose.model('user', userSchema); // Export the User model with the name 'user'
