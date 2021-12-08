const fs = require('fs')
const path = require('path')
const jimp = require('jimp')
const config = require('../config.js')

function randomString(length) {
    let result = ''
    const dict = 'abcdefghijklmnopqrstuvwxyz0123456789'
    for ( var i = 0; i < length; i++ ) {
      result += dict.charAt(Math.floor(Math.random() * dict.length))
    }
    return result
}

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }

async function getFile(path) {
    const timeout = 1000
    let i = 0

    do {
        i++

        if (i >= 10) {
            return false
        }

        await sleep(1000)
    } while (fs.existsSync(path) == false)
    return true
}

async function generateThumbnail(path, name) {
    if (await getFile(`${path}${name}`) === true) {
        let image = await jimp.read(`${path}${name}`)
        const ratio = 900 / image.bitmap.width
        image.resize(900, image.bitmap.height * ratio)
        image.quality(40)
        image.write(`${config.uploadDir}thumbnail/i/${name}`)
    } else {
        console.log('etf')
    }
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

    return {
        path: `${config.uploadDir}/${type}/`,
        name: `${filename}${ext}`
    }
}

function handle(req, res) {
    const token = (req.params.token !== undefined) ? req.params.token : req.query.token

    if (token !== undefined && config.tokens.includes(token)) {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('error')
        }

        const file = req.files.file
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

        const movedFile = moveFile(file, dir, req, res, token)

        if (ext === '.png') {
            generateThumbnail(movedFile.path, movedFile.name)
        }
    } else {
        log.info(`Unauthorized upload using token "${token}" from ${req.ip}`)
        return res.status(400).send('error')
    }
}

module.exports = {
    handle
}