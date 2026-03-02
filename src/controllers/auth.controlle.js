const UserModel = require('../models/user.model')
const EmailServers = require('../servers/email.servers')
const jwt = require('jsonwebtoken')


// user register controller
// post => /api/auth/register
async function controllerAuthRegister(req, res) {
    const { email, name, password } = req.body

    const isExists = await UserModel.findOne({
        email: email
    })

    if (isExists) {
        return res.status(422).json({
            message: "Email is already exists.",
            status: "failed"
        })
    }
    const user = await UserModel.create({
        email, name, password
    })

    // 1. You cannot name your variable `jwt` if you are calling `jwt.sign()`.
    // This will cause a ReferenceError because the inner `const jwt` shadows your `const jwt = require('jsonwebtoken')` import.
    const token = jwt.sign({
        userId: user._id
    },
        process.env.JWT_SECRET,
        {
            expiresIn: '3d'
        }
    )
    // 2. The method is `res.cookie` (singular), not `res.cookies`.
    res.cookie('token', token)


    res.status(201).json({
        user: {
            user: user._id,
            email: user.email,
            name: user.name
        },
        token
    })

    await EmailServers.sendRegistrationEmail(user.email, user.name)
}

async function controllerAuthLogin(req, res) {
    try {
        const { email, password } = req.body

        const user = await UserModel.findOne({
            email
        }).select("+password")

        if (!user) {
            return res.status(401).json({
                message: "Email and password is invaild"
            })
        }

        const ispassVaild = await user.comparePassword(password)

        if (!ispassVaild) {
            return res.status(401).json({
                message: "Email and password is invaild"
            })
        }
        const token = jwt.sign({
            userId: user._id
        },
            process.env.JWT_SECRET,
            {
                expiresIn: '3d'
            }
        )
        // 2. The method is `res.cookie` (singular), not `res.cookies`.
        res.cookie('token', token)


        res.status(201).json({
            user: {
                user: user._id,
                email: user.email,
                name: user.name
            },
            token
        })


    } catch (error) {
        res.status(404).json({
            message: error.message || "An error occurred"
        })
    }
}

module.exports = {
    controllerAuthRegister,
    controllerAuthLogin
}