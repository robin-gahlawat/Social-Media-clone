
const express = require('express');

const http = require('http');
const mongoose = require('mongoose');
const socketio = require('socket.io')
const passport = require('passport');
const methodOverride = require('method-override');
 
const flash = require('express-flash');
const session = require('express-session');

const UserPostDB = require('./models/userpost');
const UserDB = require('./models/user');



// App initialiaztion
const app = express();
const server  = http.createServer(app);

// To transfer data from frontend to request of post method.
app.use(express.urlencoded({ extended: false }))

// Connecting to database
mongoose.connect('mongodb+srv://testdb:testdb123@cluster0.uxyzv.mongodb.net/socialDb?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function(){
    console.log('connected to database.');
})


// Setting up  view engine.
app.set('view engine', 'ejs');


// Setting up passport
const initializePassport = require('./config/passport-config')
initializePassport(passport);
app.use(flash());
app.use(session({
    secret: 'key1',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'))


// Setting up routes.
const user = require('./routes/user.js');
const post = require('./routes/post.js');
const update_profile = require('./routes/update_profile');

app.use('/user', user);
app.use('/post', post);
app.use('/update_profile', update_profile);

app.delete('/user/logout', (req,res)=>{
    req.logOut();
    res.redirect('/user/login');
});



// Setting up socket io

const io = socketio(server);

io.on('connection', socket=>{

    socket.on('like',(viewpost)=>{
        const postID = viewpost.postID;
        const viewerusername = viewpost.viewerusername;

        UserDB.findOne({username: viewerusername}, function(err, user){
            if(err){
                console.log(err);
            }
            else{

                if( !(user.likedPosts.includes(postID) == true)  ){
                    user.likedPosts.push(postID);
                    user.save();

                    UserPostDB.findById({_id: postID}, function(err, post){
                        if(err){
                            console.log(err);
                        }
                        else{
                            post.likes = post.likes + 1;
                            post.save(function(err){
                                if(err)
                                    console.log(err);
                            });
                        }
                    });

                }
            }
        });
    });



    socket.on('dislike',(viewpost)=>{
        const postID = viewpost.postID;
        const viewerusername = viewpost.viewerusername;

        UserDB.findOne({username: viewerusername}, function(err, user){
            if(err){
                console.log(err);
            }
            else{

                if( (user.likedPosts.includes(postID) == true)  ){
                    user.likedPosts.pull(postID);
                    user.save();

                    UserPostDB.findById({_id: postID}, function(err, post){
                        if(err){
                            console.log(err);
                        }
                        else{
                            post.likes = post.likes - 1;
                            post.save(function(err){
                                if(err)
                                    console.log(err);
                            })
                        }
                    });

                }

            }
        });

        
    });

    // socket.on('dislike',postID=>{



    //     UserPostDB.findById({_id: postID}, function(err, post){
    //         if(err){
    //             console.log(err);
    //         }
    //         else{
    //             post.likes = post.likes - 1;
    //             post.save(function(err){
    //                 if(err)
    //                     console.log(err);
    //             })
    //         }
    //     });
    // });

    socket.on('comment', ({username, comment_message})=>{
        console.log(username + ' : ' + comment_message);
    });



});




// Starting server.

server.listen(3002,()=>{
    console.log('Server is up on 3002');
})


