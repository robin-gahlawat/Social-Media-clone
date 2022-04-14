const express = require('express');
const router = express.Router();

const passport = require('passport');
const bcrypt = require('bcrypt');

const UserDB = require('../models/user');
const UserPostDB = require('../models/userpost');
const { append } = require('express/lib/response');

const auth = require('../config/auth');

router.get('/signup', checkNotAuthenticated, function(req, res){
    res.render('user/signup', {
        title: 'Sign up'
    });
});

router.post('/signup', async function(req,res){
    const name = req.body.name;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10)


    if(name == "" || username == "" || email == "" || password == ""){
        console.log('Invalid information');
        res.redirect('/user/signup');
    }
    else{
        //console.log(name + ' ' + password);

        UserDB.findOne({ username: username }, function (err, user) {
            if (err) console.log(err);

            if (user) {
                //req.flash('danger', "Username already exists, Please choose another one");
                console.log('choose another username')
                res.redirect('/user/signup');
            }
            else {
                var user = new UserDB({
                    name: name,
                    username: username,
                    email: email,
                    password: hashedPassword
                });
                user.save(function (err) {
                    if (err)
                        console.log(err);
                    else {
                        //req.flash('success', 'You are now registered!');
                        res.redirect('/user/login');
                    }
                });
            }

        });


    } 
});



router.get('/login', checkNotAuthenticated, function(req, res){
    res.render('user/login', { 
        title: 'Login'
    });
});


router.post('/login', passport.authenticate('local', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/login',
    failureFlash: true
}));



router.get('/profile',auth , function(req, res){


    UserPostDB.find(function(err, post){
        if(err)
            console.log(err);
        
        res.render('user/profile',{
            name: req.user.name,
            username: req.user.username,
            post: post
        });
    });


});



function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect('/user/profile');
    }
    next();
}



module.exports = router;