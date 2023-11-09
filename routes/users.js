//* Users DB Schema 
const mongoose = require('mongoose')
// const plm = require("passport-local-mongoose")

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

// userSchema.plugin(plm);

module.exports = mongoose.model("user", userSchema);