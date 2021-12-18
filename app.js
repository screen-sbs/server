require('./lib/logger.js')

const express = require('express')
const fileUpload = require('express-fileupload')

const config = require('./config.js')
const pages = require('./lib/get.js')
const upload = require('./lib/post.js')


const app = express()
app.disable("x-powered-by");
app.set('view engine', 'ejs')
app.set('trust proxy', true)
app.use(express.static('public'))
app.use(express.static(config.uploadDir))
app.use(express.urlencoded())
app.use(fileUpload({
    limits: {
         fileSize: config.fileSizeLimit * 1024 * 1024
    }
}))


app.get('/', (req, res) => {
    pages.index(req, res)
})

app.get('/i:id', (req, res) => {
    pages.payload(req, res)
})

app.get('/v:id', (req, res) => {
    pages.payload(req, res)
})

app.get('/t:id', (req, res) => {
    pages.payload(req, res)
})

app.get('/upload', (req, res) => {
    pages.upload(req, res)
})

app.get('/config', (req, res) => {
    const public = {
        fileSizeLimit: config.fileSizeLimit,
        fileNameLength: config.fileNameLength
    }
    res.json(public)
})

app.post('/upload/:token', (req, res) => {
    upload.handle(req, res)
})

app.post('/upload', (req, res) => {
    upload.handle(req, res)
})

app.post('/:token', (req, res) => {
    upload.handle(req, res)
})

app.post('/', (req, res) => {
    upload.handle(req, res)
})

app.get('*', function(req, res){
    res.render('error/404', {config})
})

app.listen(config.port, () => {
    log.info(`Listening on *:${config.port}, Public url: ${config.publicUrl}`)
})