const express = require('express')
const { check } = require('express-validator')
const router = express.Router()
const linkController = require('../controllers/linkController')
const auth = require('../middleware/auth')

router.post('/',
    [
        check('originalName', 'Upload a file').not().isEmpty(),
        check('hashedName', 'Provide the hashed name').not().isEmpty()
    ],
    auth,
    linkController.newLink
)

router.get('/:url',
    linkController.hasGotPassword,
    linkController.getLink,
)

// ! To have access to protected urls
router.post('/:url',
    linkController.validatePassword,
    linkController.getLink
)

// ! THIS IS IMPORTANT TO SERVE THE APP AND CREATE ALL LINK IN A STATIC WAY WITH NEXT JS
router.get('/',
    linkController.getAllLinks
)

module.exports = router