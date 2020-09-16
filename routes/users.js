const express = require('express')
const { check } = require('express-validator')
const router = express.Router()
const userController = require('../controllers/userController')

router.post('/',
    [
        check('name', 'The name is required').not().isEmpty(),
        check('email', 'The email is not valid').isEmail(),
        check('password', 'Must be at least 6 character length').isLength({ min: 6 })
    ],
    userController.newUser
)

module.exports = router