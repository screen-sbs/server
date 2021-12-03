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

function moveFile(file, type, res) {
    const ext = path.extname(file.name)
    let filename

    do {
        filename = randomString(10)
    } while (fs.existsSync(`./public/${type}/${filename}${ext}`))

    file.mv(`./public/${type}/${filename}${ext}`, (err) => {
        if (err) {
            log.error(err)
            return res.status(500).send('error')
        }
        res.status(200).send(`${config.publicUrl}/${type}${filename}`)
    })
}

function handle(req, res) {
    if (config.tokens.includes(req.params.token) || config.tokens.includes(req.query.token)) {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).res.send('error')
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

        moveFile(file, dir, res)
    } else {
        console.log('no')
    }
}

module.exports = {
    handle
}