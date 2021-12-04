const fs = require('fs')
const path = require('path')
const config = require('../config.js')

function randomString(length) {
    let result = ''
    const dict = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for ( var i = 0; i < length; i++ ) {
      result += dict.charAt(Math.floor(Math.random() * dict.length))
    }
    return result
}

function moveFile(file, type, req, res, token) {
    const ext = path.extname(file.name)
    let filename

    do {
        filename = randomString(10)
    } while (fs.existsSync(`${config.uploadDir}/${type}/${filename}${ext}`))

    file.mv(`${config.uploadDir}/${type}/${filename}${ext}`, (err) => {
        if (err) {
            log.error(err)
            return res.status(500).send('error')
        }
        res.status(200).send(`${config.publicUrl}/${type}${filename}`)
        log.info(`Upload /${type}/${filename}${ext} using token "${token}" from ${req.ip}`)
    })
}

function handle(req, res) {
    const token = (req.params.token !== undefined) ? req.params.token : req.query.token

    if (token !== undefined && config.tokens.includes(token)) {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('error')
        }

        let file = req.files.file
        const ext = path.extname(file.name)

        let dir
        switch (ext) {
            case '.png':
                dir = 'i'
                break
            case '.txt':
                dir = 't'
                break
            case '.mp4':
                dir = 'v'
                break
        }

        moveFile(file, dir, req, res, token)
    } else {
        log.info(`Unauthorized upload using token "${token}" from ${req.ip}`)
        return res.status(400).send('error')
    }
}

module.exports = {
    handle
}