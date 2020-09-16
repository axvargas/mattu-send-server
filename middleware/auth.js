const jwt = require('jsonwebtoken')
require('dotenv').config({ path: 'variables.env' })

module.exports = (req, res, next) => {
    // * Read the Authorization header
    const authHeader = req.get('Authorization')
    if (!authHeader) {
        req.msg = "You shall no pass, there is no token"
        return next()
    }

    // * Get the token
    const token = authHeader.split(' ')[1]

    // * Verify token
    try {
        const user = jwt.verify(token, process.env.SECRET)
        req.user = user
        return next()
    } catch (error) {
        req.msg = "You shall no pass, not a valid token"
        return next()
    }
}