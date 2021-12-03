const got = require('got')

const config = require('../config.js')


function getInfo(req) {
    return {
        title: config.pageTitle + ' | ' + req.url.substring(1),
        id: req.url.substring(1),
        pageUrl: config.publicUrl + '/' + req.url.substring(1)
    }
}


function index(req, res) {
    res.render('index', {config, req})
}

function image(req, res) {
    let info = getInfo(req)
    info.payloadUrl = config.publicUrl + '/i/' + req.url.substring(2) + '.png'

    res.render('image', {config, info, req})
}

function video(req, res) {
    let info = getInfo(req)
    info.payloadUrl = config.publicUrl + '/v/' + req.url.substring(2) + '.mp4'

    res.render('video', {config, info, req})
}

async function text(req, res) {
    let info = getInfo(req)
    info.payloadUrl = config.publicUrl + '/t/' + req.url.substring(2) + '.txt'

    const textRes = await got(info.payloadUrl)
    const text = textRes.body
    //                          .replaceAll("<", "&lt;")
    //                          .replaceAll(">", "&gt;")
    //                          .replaceAll('"', "&quot;")
    //                          .replaceAll("'", "&apos;")

    res.render('text', {config, info, text, req})
}


module.exports = {
    index,
    image,
    video,
    text
}