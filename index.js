//! Attendance System Server
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const userModel = require('./models/users'); // User DB Model
const AttendanceModel = require('./models/attendance'); // attendance DB Model
const bcrypt = require('bcrypt'); // Module for Password Hashing

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

// Middleware to parse JSON
app.use(express.json());

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
// GET
app.get('/scanner', (req, res) => {
    res.render('scanner.ejs');
})
// POST
// Route To Send Scanned Names Data From Server To MongoDB
app.post('/scanner', async (req, res) => {
    const { attendanceData } = req.body;
    console.log('Received data:', req.body);

    try {
        // Assuming attendanceData is an array of objects with 'name' and 'dateTime'
        for (const entry of attendanceData) {
            // Check if the name is 'unknown' or already exists in the database
            if (entry.name !== 'unknown') {
                const existingEntry = await AttendanceModel.findOne({ name: entry.name });

                if (!existingEntry) {
                    // If the name doesn't exist, insert the entry
                    await AttendanceModel.create(entry);
                }
            }
        }

        // Respond with success status
        res.status(200).send('Attendance data saved to MongoDB!');
    } catch (error) {
        console.error('Error saving attendance data to MongoDB:', error);
        // Respond with an error status
        res.status(500).send('Internal Server Error');
    }
});

//? ViewReport Route 
// viewReport Route (Display attendance from MongoDB)
app.get('/viewReport', async (req, res) => {
    try {
        // Fetch all entries from the AttendanceModel
        const allEntries = await AttendanceModel.find();
        res.render('viewReport.ejs', { attendanceData: allEntries }); // Passing attendanceData to EJS
    } catch (error) {
        console.error('Error Fetching Attendance Data', error)
        res.status(500).send('Internal Server Error');
    }
})
// Delete an Attendance Entry from the DB
app.post('/deleteEntry', async (req, res) => {
    const { entryId } = req.body;

    try {
        // Find the entry by ID and delete it
        await AttendanceModel.findOneAndDelete({ id: entryId });

        // Redirect back to the viewReport page after deletion
        res.redirect('/viewReport');
    } catch (error) {
        console.error('Error deleting entry:', error);
        res.status(500).send('Internal Server Error');
    }
});


//? Login Route
// GET
app.get('/login', (req, res) => {
    res.render('login.ejs')
})
// POST
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
// GET
app.get('/register', (req, res) => {
    res.render('register.ejs')
})
// POST
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Check if a user with the same name or email already exists
        const existingUser = await userModel.findOne({ $or: [{ name: name }, { email: email }] });

        if (existingUser) {
            // If a user with the same name or email already exists, redirect to the registration page
            return res.redirect('/register');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        let newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword,
        });
        await newUser.save();
        // Save the new user to the database

        res.redirect('/login');     // Redirect to login page if Registration is successful
        // console.log(newUser);
    } catch (error) {
        console.error(error);
        res.redirect('/register');  // Redirect to Register page if Registration failed 
    }
});


app.listen(3000);