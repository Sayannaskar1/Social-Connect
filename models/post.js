// const mongoose=require('mongoose');


// const postSchema = new mongoose.Schema({
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'user',
//         required: true,
//         index: true
//     },
//     date: {
//         type: Date,
//         default: Date.now,
//         index: true
//     },
//     content: {
//         type: String,
//         required: true,
//         minlength: 1,
//         maxlength: 1000
//     },
//     likes: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'user',
//         unique: true
//     }]
// }, {
//     timestamps: true
// });

// module.exports = mongoose.model('post', postSchema);
const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Ensure this matches your User model name (lowercase 'user')
        required: true,
        index: true
    },
    date: {
        type: Date,
        default: Date.now,
        index: true
    },
    content: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 1000
    },
    likes: { // Define 'likes' as an object to hold its properties
        type: [{ // This defines that 'likes' is an array of user ObjectIds
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user' // Reference to the 'user' model
        }],
        default: [] // <--- IMPORTANT: This ensures 'likes' is an empty array by default if not provided
        // REMOVED: unique: true - This was the cause of the E11000 duplicate key error
    }
}, {
    timestamps: true // This automatically adds createdAt and updatedAt fields (createdAt, updatedAt)
});

module.exports = mongoose.model('post', postSchema); // Export the Post model with the name 'post'
