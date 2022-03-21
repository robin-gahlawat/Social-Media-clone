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
        //console.log(req.user.name + ' ' + req.file.originalname);    
        const result = await cloudinary.uploader.upload(req.file.path);
        console.log(result);

        const post = new UserPostDB({
            username: req.user.username,
            postinfo: {
                title: req.body.title,
                description: req.body.description,
                imageurl: result.secure_url,
                cloudinaryid: result.public_id
            }
        });

        // post.save(function (err) {
        //     if (err)
        //         console.log(err);
        //     else {
        //         //req.flash('success', 'You are now registered!');
        //         //console.log('data inserted');
        //         //res.redirect('/user/login');
        //     }
        // });

        UserPostDB.findOne({ username: username }, function (err, user) {
            if (err) console.log(err);

            if (user) {
                
                console.log('choose another username');
            }
            else {
                post.save(function (err) {
                    if (err)
                        console.log(err);
                    else {
                        //req.flash('success', 'You are now registered!');
                    }
                });
            }

        });

        res.redirect('/user/profile')
    }
    catch(e){
        console.log("Error is : " + e)
    }
})

// const multer = require('multer');
// const storage = multer.diskStorage({
//     destination: (req,file, callback)=>{
//         callback(null, 'Post_Images');
//     },
//     filename: (req,file, callback)=>{
//         const fileName = Date.now() + file.originalname;
//         callback(null, fileName)
//     }
// });

// const upload = multer({storage: storage})

// router.get('/create_post', auth, (req,res)=>{
//     res.render('post/post');
// });

// router.post('/create_post', upload.single("myImageField"), (req,res)=>{
//     console.log(req.user.name);
//     console.log('post created')
//     res.redirect('/post/create_post')
// })


module.exports = router;