const fs = require('fs')
const path = require('path')
const jimp = require('jimp')
const config = require('../config.js')

function randomString(length) {
    let result = ''
    const dict = 'abcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
      result += dict.charAt(Math.floor(Math.random() * dict.length))
    }
    return result
}

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }

async function getFile(filepath) {
    let i = 0
    do {
        i++
        if (i >= 10) {
            return false
        }
        await sleep(1000)
    } while (fs.existsSync(filepath) === false)
    return true
}

async function generateThumbnail(filepath, name) {
    if (await getFile(`${filepath}${name}`) === true) {
        const image = await jimp.read(`${filepath}${name}`)
        const ratio = 900 / image.bitmap.width
        image.resize(900, image.bitmap.height * ratio)
        image.quality(40)
        image.write(`${config.uploadDir}thumbnail/i/${name}`)
    } else {
        log.error(`File ${filepath}${name} not available in time to generate thumbnail`)
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
            return undefined
        }
        log.info(`Upload /${type}/${filename}${ext} using token "${token}" from ${req.ip}`)
    })

    return {
        path: `${config.uploadDir}/${type}/`,
        name: `${filename}${ext}`,
        url: `${config.publicUrl}/${type}${filename}`
    }
}

function handle(req, res) {
    let token
    if (req.params.token !== undefined) {
        token = req.params.token
    } else if (req.query.token !== undefined) {
        token = req.query.token
    } else if (req.body.token !== undefined) {
        token = req.body.token
    }

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
            default:
                log.error(`Invalid file extension ${ext}`)
                return res.status(400).send('error')
        }

        const movedFile = moveFile(file, dir, req, res, token)

        if (movedFile !== undefined) {
            if (ext === '.png') {
                generateThumbnail(movedFile.path, movedFile.name)
            }

            if (req.query.redirect === "true") {
                return res.status(201).redirect(movedFile.url)
            } else {
                return res.status(201).send(movedFile.url)
            }
        }
    } else {
        log.info(`Unauthorized upload using token "${token}" from ${req.ip}`)
        return res.status(401).send('error')
    }

    res.status(500).send('error')
}

module.exports = {
    handle
}