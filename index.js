//! Passport Login System Server
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const userModel = require('./models/users'); // User DB Model
const bcrypt = require('bcrypt'); // Module for Password Hashing & Salting

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/AttendanceSystem');
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.on('open', () => console.log("Connected To DB"));

// Static Files Setup
app.use(express.static('public'));
// Form Setup : for input from the frontend
app.use(express.urlencoded({ extended: false }));
// EJS Setup
app.set('view-engine', 'ejs');

//! Routes 
//? Root Route
// make this route - root home (a page with picture and login button)
app.get('/', (req, res) => {
    res.render('root.ejs');
})

//? Home Route 
app.get('/home', (req, res) => {
    res.render('home.ejs');
})

//? Scanner Route
app.get('/scanner', (req, res) => {
    res.render('scanner.ejs');
})

//! view Report Route
app.get('/report', (req, res) => {
    res.render('report.ejs');
})

//? Login Route
app.get('/login', (req, res) => {
    res.render('login.ejs')
})
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email: email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.redirect('/home');
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        console.error(error);
        res.redirect('/login');
    }
});

//? Register Route
app.get('/register', (req, res) => {
    res.render('register.ejs')
})

app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        let newUser = new userModel({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });
        await newUser.save();
        // Save the new user to the database

        res.redirect('/login');     // Redirect to login page or if Registration is successful
        // console.log(newUser);
    } catch {
        res.redirect('/register');  // Redirect to Register page if Registration failed 
    }
})

app.listen(3000);