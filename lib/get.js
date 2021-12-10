const fs = require('fs')
const got = require('got')

const config = require('../config.js')


function typeToExt(type) {
    switch (type) {
        case "i":
            return "png"
        case "v":
            return "mp4"
        case "t":
            return "txt"
        default:
            return undefined
    }
}

async function payload(req, res) {
    const info = new function() {
        this.id = req.path.substring(1)
        this.name = req.path.substring(2)
        this.type = req.path.charAt(1)
        this.ext = typeToExt(this.type)
        this.filePath = `${config.uploadDir}/${this.type}/${this.name}.${this.ext}`
        this.title = `${config.pageTitle} | ${this.id}`
        this.pageUrl = `${config.publicUrl}/${this.id}`
        this.payloadUrl = `${config.publicUrl}/${this.type}/${this.name}.${this.ext}`
        if (this.type === 'i' || this.type === 'v') {
            this.thumbnail = `${config.publicUrl}/thumbnail/${this.type}/${this.name}.png`
        }
    }
    
    if (fs.existsSync(info.filePath)) {
        switch (info.type) {
            case "i":
                res.render('image', {config, info, req})
                break
            case "v":
                res.render('video', {config, info, req})
                break
            case "t":
                const textRes = await got(info.payloadUrl)
                const text = textRes.body
                res.render('text', {config, info, text, req})
                break
            default: 
                res.render('error/404', {config})
        }
    } else {
        res.render('error/404', {config})
    }
}

function upload(req, res) {
    res.render('upload', {config, uploadError: 'none'})
}

function index(req, res) {
    res.render('index', {config, req})
}

module.exports = {
    index,
    upload,
    payload
}