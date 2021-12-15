const config = {
    port: 1998,
    publicUrl: 'http://127.0.0.1:1998',
    fileSizeLimit: 20, // MB
    pageTitle: 'screen.sbs',
    uploadDir: './upload/',
    fileNameLength: 8, // url length (excluding publicUrl length) is fileNameLength + 1
    tokens: [
        'secrettoken1' // ,
        // 'secrettoken2'
    ],
    facebookAppId: '' // not required
}

module.exports = config