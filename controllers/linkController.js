const shortid = require('shortid')
const bcrypt = require('bcrypt')
const Link = require('../models/Link')

const { validationResult } = require('express-validator')
exports.newLink = async (req, res, next) => {
    // * Check for errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.json({ errors: errors.array() })
        return next()
    }

    try {
        // * Create the object Link
        const { originalName, hashedName } = req.body
        let link = new Link()
        link.url = shortid.generate()
        link.name = hashedName
        link.originalName = originalName

        // * If user is authenticated
        if (req.user) {
            const { password, downloads } = req.body
            if (password) {
                const salt = bcrypt.genSaltSync(10)
                link.password = bcrypt.hashSync(password, salt)
            }
            if (downloads) {
                link.downloads = downloads
            }
            link.author = req.user.id
        }
        // * Store in DB
        await link.save()
        res.json({ url: `${link.url}` })
        return next()
    } catch (error) {
        console.log(error);
        res.json({ msg: "There was an error while creating the link" })
        return next()
    }
}

// * Check if the password has got password
exports.hasGotPassword = async (req, res, next) => {
    // * Obtain the link
    const { url } = req.params

    // * Check if the url exist
    const link = await Link.findOne({ url: url })

    if (!link) {
        return res.status(404).json({ msg: "This link no longer exist" })
    }
    if (link.password) {
        return res.json({ password: true, link: link.url })
    }
    next()
}

// * Validate the password to have access to the link
exports.validatePassword = async (req, res, next) => {
    const { url } = req.params
    const { password } = req.body

    const link = await Link.findOne({ url })
    if (!link) {
        return res.status(404).json({ msg: "This link no longer exist" })
    }

    if (bcrypt.compareSync(password, link.password)) {
        // * Download the file
        next()
    } else {
        // * Incorrect password
        return res.status(401).json({ msg: "Incorrect password", field: "password" })
    }
}

exports.getLink = async (req, res, next) => {
    // * Obtain the link
    const { url } = req.params

    // * Check if the url exist
    const link = await Link.findOne({ url: url })

    if (!link) {
        return res.status(404).json({ msg: "This link no longer exist" })
    }

    // * If exist you return the link name (filename)
    res.json({ file: link.name, password: false, msg: 'Go ahead and download the file' })
    return next()
}

// * Get all links for next to serve the static paths
exports.getAllLinks = async (req, res, next) => {
    try {
        const allLinks = await Link.find({}).select('url -_id');
        res.json({ links: allLinks })
        return next()
    } catch (error) {
        res.status(500).res.json({ msg: 'Server error while getting all links' })
        return next()
    }
}