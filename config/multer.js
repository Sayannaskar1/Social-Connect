// const path=require('path');
// const multer=require('multer');
// const crypto=require('crypto');


// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//     cb(null, './public/images/upload')
//     },
//     filename: function (req, file, cb) {
//         crypto.randomBytes(12,(err,bytes)=>{
//         const fn  =bytes.toString('hex')+path.extname(file.originalname);
//         cb(null,fn);})}})

//     const upload = multer({ storage: storage });
//     module.exports=upload;
const path = require('path');
const multer = require('multer');
const crypto = require('crypto'); // Used for generating random filenames


// Set storage engine
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // This path is crucial. It tells Multer where to save the files.
        // It resolves to: C:\Users\91628\OneDrive\Desktop\Social-Connect\public\image\upload
        // assuming multer.js is in 'config' folder and 'public' is in the project root.
        cb(null, path.join(__dirname, '..', 'public', 'images', 'upload'));
    },
    filename: function(req, file, cb) {
        // This creates a unique filename for the uploaded image using crypto
        // e.g., 'abcdef1234567890.png'
        crypto.randomBytes(12, (err, bytes) => {
            if (err) return cb(err); // Handle error during randomBytes generation
            const filename = bytes.toString('hex') + path.extname(file.originalname);
            cb(null, filename);
        });
    }
});

// Initialize upload middleware
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit (in bytes)
    fileFilter: function(req, file, cb) {
        // Call helper function to validate file type
        checkFileType(file, cb);
    }
});

// Helper function to check file type (only allows images)
function checkFileType(file, cb) {
    // Allowed extensions regex (case-insensitive)
    const filetypes = /jpeg|jpg|png|gif/;
    // Check file extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime type (ensures it's an image)
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true); // Accept file
    } else {
        cb(new Error('Error: Only images (jpeg, jpg, png, gif) are allowed!')); // Reject file with an Error object
    }
}

module.exports = upload;
