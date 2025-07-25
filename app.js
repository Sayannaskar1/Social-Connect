<<<<<<< HEAD
// app.js
require('dotenv').config(); // <--- This must be at the very top!

=======
require('dotenv').config();
>>>>>>> 934fdc3c92870612cb33625095951d81b0203754
const express=require('express');
const userModel=require('./models/user')
const postModel=require('./models/post');
const mongoose = require('mongoose');
const path=require('path'); // Ensure path is imported

<<<<<<< HEAD
// Define PORT constant by reading from process.env
const PORT = parseInt(process.env.PORT, 10) || 3000;

// Ensure process.env.DB_URL is correctly loaded from your .env file
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection failed', err));
=======
mongoose.connect(process.env.DB_URL)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error(err));
>>>>>>> 934fdc3c92870612cb33625095951d81b0203754


const app=express();
const cookieParser=require('cookie-parser');
app.use(cookieParser())
var jwt = require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const user = require('./models/user'); // This import seems unused or redundant if userModel is used
const upload = require('./config/multer'); // Assuming this path is correct
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

// --- EJS View Engine Setup ---
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views')); // <--- THIS LINE IS CRUCIAL FOR EJS TO WORK


app.get('/',(req,res)=>{
res.render('index'); // Ensure 'index.ejs' is also in the 'views' folder
})

app.post('/create',(req,res)=>{
    var {name,username,email,age,password}=req.body;

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, async function(err, hash) {
            // Store hash in your password DB.
<<<<<<< HEAD
            var user= await userModel.findOne({email});
            if(user){
                return res.status(409).send('User with this email already exists.');
            }
            const data= await userModel.create({
                name,
                username,
                email,
                age,
                password:hash
            });
            // Use process.env.SESSION_SECRET here
            var token = jwt.sign({ email:email }, process.env.SESSION_SECRET);
            res.cookie('token',token);
            res.redirect('/profile');
        });
    });
});

app.get('/logout',(req,res)=>{
=======
    var user= await userModel.findOne({email});
    if(user){return res.status(300).redirect('/profile')}
    const data= await userModel.create({
    name,
    username,
    email,
    age,
    password:hash})
    var token = jwt.sign({ email:email }, process.env.SECRET_KEY);
    res.cookie('token',token);
    res.redirect('/profile');});});})
    app.get('/logout',(req,res)=>{
>>>>>>> 934fdc3c92870612cb33625095951d81b0203754
    res.cookie("token","");
    res.redirect('/login');
});

app.get('/login',(req,res)=>{
    res.render('login'); // Ensure 'login.ejs' is also in the 'views' folder
});

app.post('/login',async(req,res)=>{
    var {email,password}=req.body;
    var user= await userModel.findOne({email});
    if(!user){
        return res.status(400).send('Invalid email or password!');
    }
    else{
        bcrypt.compare(password, user.password, function(err, result) {
<<<<<<< HEAD
            if(result){
                // Use process.env.SESSION_SECRET here
                var token = jwt.sign({ email:email }, process.env.SESSION_SECRET);
                res.cookie('token',token);
                res.redirect('/profile');
            }
            else {
                res.status(401).send("Invalid email or password!");
            }
        });
    }
});

app.get('/profile',islogged, async(req,res)=>{
    const user= await userModel.findOne({email:req.user.email}).populate('posts');
    console.log(user); // Check this in your backend console
    res.render('profile',{user}); // Renders profile.ejs
});

function islogged(req,res,next){
    if(!req.cookies.token){
        res.redirect('/login');
    }
    else{
        try {
            // Use process.env.SESSION_SECRET here
            const data=jwt.verify(req.cookies.token, process.env.SESSION_SECRET);
            req.user=data;
            next();
        } catch (error) {
            res.clearCookie('token');
            res.redirect('/login');
        }
    }
}

app.post('/post',islogged, async(req,res)=>{
    const user= await userModel.findOne({email:req.user.email});
    const post= await postModel.create({
=======
        if(result){ var token = jwt.sign({ email:email }, process.env.SECRET_KEY);
        res.cookie('token',token);
        res.redirect('/profile')}
        else {res.send("somthing wents wrong!");}
        });}})

app.get('/profile',islogged, async(req,res)=>{
    const user=  await userModel.findOne({email:req.user.email}).populate('posts');
    console.log(user);
    res.render('profile',{user});})
    function islogged(req,res,next){
    if(req.cookies.token===''){res.redirect('/login');alert("you must log in ")}
    else{const data=jwt.verify(req.cookies.token,process.env.SECRET_KEY);
    req.user=data;
    next();} }
    app.post('/post',islogged, async(req,res)=>{
        const user=  await userModel.findOne({email:req.user.email});
        const post= await postModel.create({
>>>>>>> 934fdc3c92870612cb33625095951d81b0203754
        user:user._id,
        content:req.body.content,
    });
    user.posts.push(post._id);
    await user.save();
    res.redirect('/profile');
});

app.get('/like/:id',islogged, async(req,res)=>{
    const user= await userModel.findOne({email:req.user.email});
    const post= await postModel.findOne({_id:req.params.id});
    if(post.likes.indexOf(user._id)==-1){
        post.likes.push(user._id);
    }
    else{
        post.likes.splice(post.likes.indexOf(user._id),1);
    }
    await post.save();
    res.redirect('/profile');
});

app.get('/edit/:id',islogged, async(req,res)=>{
    const post= await postModel.findOne({_id:req.params.id});
    res.render('edit',{post}); // Ensure 'edit.ejs' is in 'views'
});

app.post('/update/:id',islogged, async(req,res)=>{
    const post= await postModel.findOne({_id:req.params.id});
    var{content}=req.body;
    post.content=content;
    await post.save();
    res.redirect('/profile');
});

app.get('/profile/upload',islogged,async(req,res)=>{
    const user= await userModel.findOne({email:req.user.email});
    res.render('task',{user}); // Ensure 'task.ejs' is in 'views'
});

app.post('/upload',islogged,upload.single('bal'),async(req,res)=>{
    const user= await userModel.findOne({email:req.user.email});
    if (req.file) {
        user.profilepicture = req.file.filename;
        await user.save();
    }
    res.redirect('/profile');
});

<<<<<<< HEAD
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
=======
     



       
    })







const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
>>>>>>> 934fdc3c92870612cb33625095951d81b0203754
