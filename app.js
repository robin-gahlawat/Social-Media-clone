
const express = require('express');

const mongoose = require('mongoose');

const passport = require('passport');
const methodOverride = require('method-override');
 
const flash = require('express-flash');
const session = require('express-session');

// App initialiaztion
const app = express();

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




// Setting up passport
//require('./config/passport-config')(passport);
//app.use(passport.initialize());
//app.use(passport.session());



// Setting up routes.
const user = require('./routes/user.js');
const post = require('./routes/post.js');


app.use('/user', user);
app.use('/post', post);


app.delete('/user/logout', (req,res)=>{
    req.logOut();
    res.redirect('/user/login');
})






// Starting server.

app.listen(3002,()=>{
    console.log('Server is up on 3002');
})


