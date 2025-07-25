const mongoose=require('mongoose');


const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
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
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        unique: true
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('post', postSchema);