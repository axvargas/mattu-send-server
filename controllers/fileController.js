const shortid = require('shortid')
const multer = require('multer')
const fs = require('fs')
const Link = require('../models/Link')

exports.uploadFile = async (req, res, next) => {

    const multerConfig = {
        limits: { fileSize: req.user ? 1024 * 1024 * 12 : 1024 * 1024 },   // * 1024*1024==1000000==1MB
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, __dirname + '/../uploads')
            },
            filename: (req, file, cb) => {
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length)
                cb(null, `${shortid.generate()}${extension}`)
            },
            // ! In case you don't want to acept pdfs
            // fileFilter: (req, res, cb) => {
            //     if (file.mimetype === 'application/pdf') {
            //         return cb(null, true)
            //     }
            // }
        })
    }

    const upload = multer(multerConfig).single('file')
    upload(req, res, async (error) => {
        if (!error) {
            res.json({ file: req.file.filename })
            return next()
        }
        return next()
    })
}

exports.deleteFile = async (req, res, next) => {
    try {
        fs.unlinkSync(__dirname + `/../uploads/${req.file}`)
    } catch (error) {
        console.log(error);
    }
}

// *DOWNLOAD THE FILE
exports.downloadFile = async (req, res, next) => {
    const { file } = req.params
    const fileToDownload = __dirname + `/../uploads/${file}`
    res.download(fileToDownload)

    // ! Get the link asocciated to the file, in prder to check the downloads number
    const link = await Link.findOne({ name: file })

    // * Delete the file from the DB
    const { downloads, name } = link
    // * If downloads === 1, delete the link
    if (downloads === 1) {
        req.file = name
        // * Delete the DB entry
        await Link.findOneAndRemove(link.id)
        // * Delete the file
        next()
    } else {
        // * If downloads < 1, downloads - 1
        link.downloads--
        await link.save()
    }

}