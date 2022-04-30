const express = require('express');
const router = express.Router();

const auth = require('../config/auth');

const cloudinary = require('../config/cloudinary-config');
const upload = require('../config/multer');

const UserPostDB = require('../models/userpost');


router.get('/create_post', auth, (req,res)=>{
    res.render('post/post');
});

router.post('/create_post', upload.single("myImageField"), async (req,res)=>{
    
    try{
        const result = await cloudinary.uploader.upload(req.file.path);
        console.log(result);

        const username = req.user.username;

        const post = new UserPostDB({
            username: username,
            postinfo: {
                title: req.body.title,
                description: req.body.description,
                imageurl: result.secure_url,
                cloudinaryid: result.public_id
            },
            likes: 0
        });

        post.save(function (err) {
            if (err)
                console.log(err);
            else {
                //req.flash('success', 'You are now registered!');
            }
        });

        res.redirect('/user/profile')
    }
    catch(e){
        console.log("Error is : " + e)
    }
});


router.get('/:id', auth, (req,res)=>{

    const id = req.params.id;
    const viewerusername = req.user.username;


    UserPostDB.find(function(err, posts){
        if(err)
            console.log(err);
        
        posts.forEach(function(post){
            if(post._id == id){
                res.render('post/detailed_post',{
                    viewerusername: viewerusername,
                    post: post
                });
            }
        });
        
    });

});


module.exports = router;