require('dotenv').config();
const express=require('express');
const userModel=require('./models/user')
const postModel=require('./models/post');
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection failed', err));

// const Upload=require('upload');
const path=require('path');
const app=express();
const cookieParser=require('cookie-parser');
app.use(cookieParser())
var jwt = require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const user = require('./models/user');
const upload = require('./config/multer');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.set('view engine','ejs');


app.get('/',(req,res)=>{
res.render('index');
})
app.post('/create',(req,res)=>{
    var {name,username,email,age,password}=req.body;

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, async function(err, hash) {
            // Store hash in your password DB.
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
    res.cookie("token","");
res.redirect('/login');})
app.get('/login',(req,res)=>{
    res.render('login');
    })
    app.post('/login',async(req,res)=>{
    var {email,password}=req.body;
    var user= await userModel.findOne({email});
    if(!user)res.send('something wents wrong!');
    else{
        bcrypt.compare(password, user.password, function(err, result) {
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
        user:user._id,
        content:req.body.content,})
        user.posts.push(post._id);
        await user.save();
        res.redirect('/profile');})
        app.get('/like/:id',islogged, async(req,res)=>{
        const user=  await userModel.findOne({email:req.user.email});
        const post=  await postModel.findOne({_id:req.params.id});
        if(post.likes.indexOf(user._id)==-1){post.likes.push(user._id);}
        else{post.likes.splice(post.likes.indexOf(user._id),1);}
        await post.save();
        res.redirect('/profile');})
        app.get('/edit/:id',islogged, async(req,res)=>{
        const post=  await postModel.findOne({_id:req.params.id});
    res.render('edit',{post});})
    app.post('/update/:id',islogged, async(req,res)=>{
    const post=  await postModel.findOne({_id:req.params.id});
    var{content}=req.body;
    post.content=content;
    await post.save();
    res.redirect('/profile');})

    app.get('/profile/upload',islogged,async(req,res)=>{
        const user=  await userModel.findOne({email:req.user.email});
        res.render('task',{user})
    })
    app.post('/upload',islogged,upload.single('bal'),async(req,res)=>{
        const user=  await userModel.findOne({email:req.user.email});
        user.profilepicture =req.file.filename;
        await user.save();
        res.redirect('/profile',{user});

     



       
    })







const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});