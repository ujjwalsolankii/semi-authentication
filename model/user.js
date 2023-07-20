const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        default: null,
    },
    lname: {
        type: String,
        default: null,
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'send aan email'],
    },
    password: {
        type: String,
    },
    token: {
        type: String,
    },
})

module.exports = mongoose.model("User", userSchema);



