const express = require('express')
const { check } = require('express-validator')
const router = express.Router()
const authController = require('../controllers/authController')
const auth = require('../middleware/auth')
router.post('/',
    [
        check('email', 'The email is not valid').isEmail(),
        check('password', 'Must be at least 6 character length').not().isEmpty()
    ],
    authController.authUser
)

router.get('/',
    auth,
    authController.userAuthenticated
)
module.exports = router