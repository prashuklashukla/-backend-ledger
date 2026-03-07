const accountModel = require('../models/account.model')


async function createAccountController(req, res) {
    const user = req.user
    const account = await accountModel.create({
        user: user._id
    })

    res.status(201).json({
        account
    })
}

async function getUserAccountsController(req, res) {
    res.status(200).json({ message: "Not implemented" });
}

async function getAccountBalanceController(req, res) {
    res.status(200).json({ message: "Not implemented" });
}

module.exports = {
    createAccountController,
    getUserAccountsController,
    getAccountBalanceController
}