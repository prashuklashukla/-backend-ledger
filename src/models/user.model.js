const mongoose = require('mongoose')
const bcrpty = require('bcryptjs')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email was required to create user."],
        trim: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid Email address"],
        unique: [true, "Email is already is exist "]
    },
    name: {
        type: String,
        required: [true, "name was required to create user."]
    },
    password: {
        type: String,
        required: [true, "password was required to create a account."],
        minlength: [6, 'mim 6 letter is required to create a accout'],
        select: false
    },

}, {
    timestamps: true
})

userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) {
        return next()
    }

    const hash = await bcrpty.hash(this.password, 10)
    this.password = hash
})

userSchema.methods.comparePassword = async function (password) {

    console.log("password", this.password)
    return await bcrpty.compare(password, this.password)
}

const UserModel = mongoose.model("User", userSchema)
module.exports = UserModel       