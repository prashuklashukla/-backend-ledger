const transactionModel = require("../models/transaction.models")
const legderModels = require('../models/legder.models')
const accountModel = require("../models/account.models")
const EmailServers = require('../servers/email.servers')
const mongoose = require("mongoose")

/**
 * - Create a new transaction
 * THE 10-STEP TRANSFER FLOW:
     * 1. Validate request
     * 2. Validate idempotency key
     * 3. Check account status
     * 4. Derive sender balance from ledger
     * 5. Create transaction (PENDING)
     * 6. Create DEBIT ledger entry
     * 7. Create CREDIT ledger entry
     * 8. Mark transaction COMPLETED
     * 9. Commit MongoDB session
     * 10. Send email notification
 */

async function createTransaction(req, res) {
    /**
     * 1. validate requirst
     */

    const { fromAccount, toAccount, amount, idempotencyKey } = req.body

    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "fromAccount, TOAccount, Account or idempotenctKey are required"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        _id: fromAccount
    })

    const toUserAccount = await accountModel.findOne({
        _id: toAccount
    })

    if (!fromUserAccount || !toUserAccount) {
        return res.status(400).json({
            message: "invlaid fromAcount to toAccount"
        })
    }


    /*
     * 2. Validate idempotency key
    */
    const isTransactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey: idempotencyKey
    })

    if (isTransactionAlreadyExists) {
        if (isTransactionAlreadyExists.status === 'COMPLETED') {
            return res.status(200).json({
                message: "Transaction already processing",
                transaction: isTransactionAlreadyExists
            })
        }

        if (isTransactionAlreadyExists.status === 'FAILED') {
            return res.status(500).json({
                message: "Transaction processing failed, please retry"
            })
        }

        if (isTransactionAlreadyExists.status === 'PENDING') {
            return res.status(200).json({
                message: "Transaction is still processing",
            })
        }
        if (isTransactionAlreadyExists.status === 'REVERSED') {
            return res.status(500).json({
                message: "Transaction was reversed, please retry"
            })
        }

    }

    /**
   * 3. Check account status
   */

    if (fromUserAccount.status !== 'ACTIVE' || toUserAccount !== 'ACTIVE') {
        res.status(400).json({
            message: 'Both Account must be Active to process transaction'
        })
    }

    /**
     *  * 4. Derive sender balance from ledger
     */

    const balance = await fromUserAccount.getBalance()

    if (balance < amount) {
        res.status(400).json({
            message: `Insufficient balance. Your current balance is ${balance}. Your required balance is ${amount}`
        })
    }

    /**
     *  * 5. Create transaction (PENDING)
     */

    const session = await mongoose.startSession()
    session.startTransaction()

    const transaction = await transactionModel.create({
        fromAccount: fromAccount,
        toAccount: toAccount,
        amount: amount,
        idempotencyKey: idempotencyKey,
        status: 'PENDING'

    }, { session })


    const DebitLegberEntry = await legderModels.create({
        account: fromAccount,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT"
    }, { session })


    const CREDITLegberEntry = await legderModels.create({
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT"
    }, { session })

    transaction.status = "COMPLETED"
    await transaction.save({ session })

    await session.commitTransaction()
    session.endSession()
    /**
     * * 10. Send email notification
     */

    await emailService.sendTransactionEmail(req.user.email, req.user.name, amount, toAccount)

    return res.status(201).json({
        message: "Transaction completed successfully",
        transaction: transaction
    })

}

module.exports = {
    createTransaction
}