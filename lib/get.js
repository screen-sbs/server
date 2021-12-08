const fs = require('fs')
const got = require('got')

const config = require('../config.js')


function typeToExt(type) {
    switch (type) {
        case "i":
            return "png"
            break
        case "v":
            return "mp4"
            break
        case "t":
            return "txt"
            break
    }
    return undefined
}

async function payload(req, res) {
    let info = new function() {
        this.id = req.url.substring(1)
        this.name = req.url.substring(2)
        this.type = req.url.charAt(1)
        this.ext = typeToExt(this.type)
        this.filePath = `${config.uploadDir}/${this.type}/${this.name}.${this.ext}`
        this.title = `${config.pageTitle} | ${this.id}`
        this.pageUrl = `${config.publicUrl}/${this.id}`
        this.payloadUrl = `${config.publicUrl}/${this.type}/${this.name}.${this.ext}`
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
        }
    } else {
        res.render('error/404', {config})
    }
}

function index(req, res) {
    res.render('index', {config, req})
}

module.exports = {
    index,
    payload
}