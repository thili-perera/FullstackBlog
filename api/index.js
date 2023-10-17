const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const User = require('./models/User');
const Post = require('./models/Post');
const app = express();
const multer = require('multer');
const uploadMiddleware = multer({dest: 'uploads/'});
const fs = require('fs');

const salt = bcrypt.genSaltSync(10);
const secret = 'fbvjnfbkcjfhbvkjchbkj';

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads',express.static(__dirname + '/uploads'));//uploads folder is inside the FULLSTACKBLOG..

mongoose.connect('mongodb+srv://thilidulanjani26:urftUFP2926ubbOt@cluster0.efq8ng9.mongodb.net/?retryWrites=true&w=majority');

app.post('/register', async(req,res)=>{
    const {username,password} = req.body;
    try{
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password,salt),
        });
        res.json(userDoc);
    }catch(e){
        res.status(400).json(e);
    }
});

app.post('/login',async(req,res)=>{
    try{
        const {username,password} = req.body;
        const userDoc = await User.findOne({username});
        const passOk = bcrypt.compareSync(password,userDoc.password);

        if(passOk){
            //logged in
            jwt.sign({username,id:userDoc._id},secret, {}, (err,token)=>{
                if(err) throw err; //if error
                res.cookie('token',token).json({
                    id:userDoc._id,
                    username,
                }); //set 'token' to token
             });
        }else{
            res.status(400).json('incorrect credentials');
        }
    }catch(e){

    }
});

app.get('/profile',(req,res)=>{
    try{
        const {token} = req.cookies;
        jwt.verify(token,secret,{},(err,info)=>{ //get incomming token info
            if (err) throw err;
            res.json(info);
        });
    }catch(e){

    }
});

app.post('/logout',(req,res)=>{
    try{
        res.cookie('token','').json('ok'); //set token to empty because we're goint to logout..no need of token
    }catch(e){

    }
})

app.post('/post',uploadMiddleware.single('file'), async (req,res)=>{
    try{
        const {originalname,path} = req.file;//get originalname,path from request file's details
        const parts = originalname.split('.'); //split file name by '.'
        const ext = parts[parts.length-1]; //get extention of file
        const newPath = path+'.'+ext;//rename file name with file extention 
        fs.renameSync(path,newPath); //save file with new name 

        //to get logged user details
        const {token} = req.cookies;
        jwt.verify(token,secret,{}, async(err,info)=>{ //when the token is verified the token info is inside the 'info'
            if (err) throw err;
            const postDoc = await Post.create({
                title: req.body.title,
                summary: req.body.summary,
                content: req.body.content,
                cover: newPath,
                author: info.id,
             })
             res.json(postDoc) 
        });
    }catch(e){

    }
})

app.get('/post', async (req,res)=>{
    const posts = await Post.find().populate('author',['username']).sort({createdAt:-1}).limit(20);//descending order
    // console.log(posts);
    res.json(posts);
})

app.get('/post/:id', async (req,res)=>{
    try{
        const {id} = req.params;
        const postDoc = await Post.findById(id).populate('author',['username']);//get authors details from 'author' id using 'populate'
        res.json(postDoc);
    }catch(e){

    }
})

app.put('/post',uploadMiddleware.single('file'), async(req,res)=>{
    try{
        let newPath = null;
        if(req.file){
            const {originalname,path} = req.file;//get originalname,path from request file's details
            const parts = originalname.split('.'); //split file name by '.'
            const ext = parts[parts.length-1]; //get extention of file
            const newPath = path+'.'+ext;//rename file name with file extention 
            fs.renameSync(path,newPath); //save file with new name 
        }   

        //to get logged user details
        const {token} = req.cookies;
        jwt.verify(token,secret,{}, async(err,info)=>{ //when the token is verified the token info is inside the 'info'
            if (err) throw err;

            const postDoc = await Post.findById(req.body.id);
            const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
            if(!isAuthor) {
                return res.status(400).json('You are not the author');
            }

            // await postDoc.update({
            //     title: req.body.title,
            //     summary: req.body.summary,
            //     content: req.body.content,
            //     cover: newPath ? newPath : postDoc.cover,//if have a newPath then save it otherwise save existing path(postDoc.cover)
            //     author: info.id,
            //  });

            const updatedPost = await Post.findOneAndUpdate(
                { _id: req.body.id },
                {
                  title: req.body.title,
                  summary: req.body.summary,
                  content: req.body.content,
                  cover: newPath ? newPath : postDoc.cover,//if have a newPath then save it otherwise save existing path(postDoc.cover)
                },
              );

             res.json(updatedPost) 
        });

    }catch(e){
        
    }
})

app.listen(4000);

//urftUFP2926ubbOt
//thilidulanjani26

//mongodb+srv://thilidulanjani26:urftUFP2926ubbOt@cluster0.efq8ng9.mongodb.net/?retryWrites=true&w=majority