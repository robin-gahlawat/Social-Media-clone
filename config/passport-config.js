var LocalStrategy = require('passport-local').Strategy;
var UserDB = require('../models/user');
var bcrypt = require('bcrypt');


 function initialize(passport) {

    const authenticateUser = async (username, password, done) => {
        
        UserDB.findOne({ username: username },async function (err, user) {
            
            if (err)
                console.log(err);

            if (!user) {
                return done(null, false, { message: 'No user found!' });
            }

            await bcrypt.compare(password, user.password, function (err, isMatch) {
                if (err) console.log(err);
                if (isMatch) {
                    return done(null, user);
                }
                else {
                    return done(null, false);
                }
            });

        });
    }



    passport.use(new LocalStrategy({ usernameField: 'username', passwordField: 'password' }, authenticateUser))


    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        UserDB.findById(id, function(err, user){
            return done(err, user);
        });
    })

}

module.exports = initialize


// module.exports = function(passport) {

//     passport.use(new LocalStrategy(function(username, password, done){


//         UserDB.findOne({username: username}, function(err, user) {

//             if(err)
//             console.log(err);

//             if(!user){
//                 return done(null, false, {message: 'No user found!'});
//             }

//              bcrypt.compare(password, user.password, function(err, isMatch) {
//                 if(err) console.log(err);
//                 if(isMatch){
//                     return done(null, user);
//                 }
//                 else{
//                     return done(null, false);
//                 }
//             });

//         });


//     }));

//     passport.serializeUser(function(user, done){
//         done(null, user.id);
//     });

//     passport.deserializeUser(function(id, done){
//         UserDB.findById(id, function(err, user){
//             done(err, user);
//         });
//     });


// }

