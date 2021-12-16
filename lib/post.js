const fs = require('fs')
const path = require('path')
const jimp = require('jimp')
const ffmpeg = require('ffmpeg-static')
const genThumbnail = require('simple-thumbnail')

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
        if (name.endsWith('.png')) {
            const image = await jimp.read(`${filepath}${name}`)
            const ratio = 900 / image.bitmap.width
            image.resize(900, image.bitmap.height * ratio)
            image.quality(40)
            image.write(`${config.uploadDir}thumbnail/i/${name}`)
        } else if (name.endsWith('.mp4')) {
            await genThumbnail(`${filepath}${name}`, `${config.uploadDir}thumbnail/v/${name.substring(0, name.length - 4)}.png`, '900x?', {
                path: ffmpeg
            })
        }
    } else {
        log.error(`File ${filepath}${name} not available in time to generate thumbnail`)
    }
}

function moveFile(file, type, req, res, token) {
    const ext = path.extname(file.name)
    let filename

    do {
        filename = randomString(config.fileNameLength)
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
            if (req.query.redirect === "true") { 
                return res.render('upload', {config, uploadError: 'No file specified'})
            }
            return res.status(400).send('error')
        }

        if (req.files.file.truncated) {
            log.info(`Size limited exceeded by "${token}" from ${req.ip}`)
            if (req.query.redirect === "true") { 
                return res.render('upload', {config, uploadError: `File exceeding max size of ${config.fileSizeLimit}MB`})
            }
            return res.status(413).send('error')
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
                log.info(`Invalid file extension ${ext}`)
                if (req.query.redirect === "true") { 
                    return res.render('upload', {config, uploadError: 'Unsupported file format'})
                }
                return res.status(400).send('error')
        }

        const movedFile = moveFile(file, dir, req, res, token)

        if (movedFile !== undefined) {
            if (ext === '.png' || ext === '.mp4') {
                generateThumbnail(movedFile.path, movedFile.name)
            }

            if (req.query.redirect === "true") {
                return res.status(201).redirect(movedFile.url)
            }
            return res.status(201).send(movedFile.url)
        }
    } else {
        log.info(`Unauthorized upload using token "${token}" from ${req.ip}`)

        if (req.query.redirect === "true") { 
            return res.render('upload', {config, uploadError: 'Invalid token'})
        }
        return res.status(401).send('error')
    }

    if (req.query.redirect === "true") { 
        return res.render('upload', {config, uploadError: 'Error while processing file'})
    }
    res.status(500).send('error')
}

module.exports = {
    handle
}