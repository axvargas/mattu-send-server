const express = require('express')
const cors = require('cors')
const { connect } = require('mongoose')
const conectDB = require('./config/db')
// * Create server
const app = express()

// * Enable cors
const corsOptions = {
    origin: process.env.FRONTEND_URL
}
app.use(cors(corsOptions))

// * Enable read values via body
app.use(express.json())

// ! Enable public folder to download files
app.use(express.static('uploads'))

// * Connect to DB
conectDB()

// * Routes for the app
app.use('/api/users', require('./routes/users'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/links', require('./routes/links'))
app.use('/api/files', require('./routes/files'))

// * App port
const port = process.env.PORT || 4000;

// * Start the app
app.listen(port, '0.0.0.0', () => {
    console.log(`Server runing on port ${port}`)
})