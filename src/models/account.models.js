const mongoose = require('mongoose')

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "Account must be associated with user"],
        index: true
    },
    status: {
        type: String,
        enum: {
            values: ['ACTIVE', 'FROZEN', 'CLOSED'],
            message: "Message must be Active , Frozen 0r closed.",

        },
        default: "ACTIVE"
    },
    currency: {
        type: String,
        required: [true, "Curring is required to cteate a account."],
        default: 'IRN'
    }
},
    {
        timestamps: true
    })

accountSchema.index({ user: 1, status: 1 })

const accountModel = mongoose.model("account", accountSchema)
module.exports = accountModel
