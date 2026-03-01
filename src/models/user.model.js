const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: [true, "Email was required to create user."],
        trim: true,
        lowercase: true,
        match: [ /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ , "Invalid Email address"],
        unique: [true, "Email is already is exist "]
    },
    name: {
        type: String,
        required:  [true, "name was required to create user."]
    },
    password:{
        type: String,
        required:[true,  "password was required to create a account."],
        minlenght: [6, 'mim 6 letter is required to create a accout'],
        select: false
    },
    
}, {
        timestamps: true
    })