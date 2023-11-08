//* Attendance schema
const mongoose = require('mongoose');

// Schema
const attendanceSchema = mongoose.Schema({
    name : String,
    date : new Date(),
})


module.exports = mongoose.model("attendance",attendanceSchema);