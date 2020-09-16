const User = require('../models/User')
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')
exports.newUser = async (req, res, next) => {
    // * Check if there are errors from 'express-validator'
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.json({ errors: errors.array() })
        return next()
    }
    const { email, name, password } = req.body
    // * Check if the user is already registered
    try {
        let user = await User.findOne({ email })
        if (user) {
            res.status(400).json({ msg: 'User already registered' })
            return next()
        }

        // * Create new user
        user = new User(req.body)

        // * Hash the password
        const salt = bcrypt.genSaltSync(10)
        user.password = bcrypt.hashSync(password, salt)

        // * save the user to DB
        await user.save()
        res.json({ msg: 'User successfully created' })
        return next()
    } catch (error) {
        console.log(error)
        res.status(400).send("There was an error at user's creation")
        return next()
    }
}