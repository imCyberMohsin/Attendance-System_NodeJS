//* Attendance Model
const mongoose = require('mongoose');

// Attendance Schema
const attendanceSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        default: () => Math.floor(Math.random() * 1000), // Generate a random number between 0 and 999
    },
    name: {
        type: String,
        required: true,
        default: "Name pass failed from client-side",
    },
    department: {
        type: String,
        default: "BCA",
    },
    dateTime: {
        type: String,
        default: () => new Date().toLocaleString('en-US', { hour12: true }),
    },
});


const AttendanceModel = mongoose.model('Attendance', attendanceSchema);
module.exports = AttendanceModel;