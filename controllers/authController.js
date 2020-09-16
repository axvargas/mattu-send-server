const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: 'variables.env' })

const { validationResult } = require('express-validator')
exports.authUser = async (req, res, next) => {
    // * Check for errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.json({ errors: errors.array() })
        return next()
    }

    const { email, password } = req.body
    try {
        // * Check if the user is registered
        const user = await User.findOne({ email })

        if (!user) {
            res.status(401).json({ msg: "The user is not registered" })
            return next()
        }

        // * Check the password and auth the user
        if (!bcrypt.compareSync(password, user.password)) {
            res.status(401).json({ msg: "Incorrect password" })
            return next();
        }

        // * JWT thing
        const payload = {
            id: user._id,
            name: user.name,
            email: user.email
        }
        const token = jwt.sign(payload, process.env.SECRET, {
            expiresIn: 12 * 3600                                 // ! 12 hours
        })
        res.json({ msg: "Successfully signed in", token })
    } catch (error) {
        res.status(401).send("There was an error at user's authentication")
    }



}

exports.userAuthenticated = async (req, res, next) => {
    if (req.user) {
        res.json({ user: req.user })
        return next()
    }
    res.status(401).json({ msg: req.msg })
    return next()
}