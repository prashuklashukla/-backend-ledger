const accountModels = require('../models/account.models')


async function accountController(req, res) {
    const user = req.user
    const account = await accountModels.create({
        user: user._id
    })

    res.status(201).json({
        account
    })
}
module.exports = {
    accountController
}