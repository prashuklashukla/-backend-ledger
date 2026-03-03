const express = require('express')
const cookieparser = require('cookie-parser')


const app = express()
app.use(cookieparser())
app.use(express.json())


// Routes


const authRoutes = require('./routes/auth.routes')
const accountRoutes = require('./routes/account.routes')

// user Routes

app.use('/api/auth', authRoutes)
app.use('/api/account', accountRoutes)



module.exports = app