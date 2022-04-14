const express = require('express');
const router = express.Router();

const auth = require('../config/auth');

const UserDB = require('../models/user')

router.get('/', auth, (req,res)=>{

    UserDB.findOne({username: req.user.username}, (err,user)=>{
        user = user;
        if(err){
            res.send('Error in loading data from database!');
        }
        else{
            res.render('user/update_profile', {
                user: user
            }); 
        }
    });

});


router.post('/', async (req,res)=>{


    const updatedUser = {
        name: req.body.name
    }

    await UserDB.findOneAndUpdate({username: req.user.username}, updatedUser);
    res.redirect('/user/profile')


    // UserDB.findOneAndUpdate({username: req.user.username}, (err,user)=>{
    //     user = user;
    //     if(err){
    //         res.send('Error in loading data from database!');
    //     }
    //     else{
    //         res.render('user/update_profile', {
    //             user: user
    //         }); 
    //     }
    // });

});



module.exports = router;