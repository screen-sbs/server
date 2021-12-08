# screen.sbs
## Server

#### Requirements
- NodeJS (16-ish)

#### Installation
- Clone the repository
  - ```git clone git@github.com:screen-sbs/server.git```
- Install npm packages
  - ```npm install .```
- Install pm2
  - ```npm install pm2 --global```
- Copy example config file
  - ```cp config.example.js config.js```
- Edit config.js
  - ```nano config.js```
- Run
  - ```pm2 start```


#### Uploads
- post file to /upload/<token>
  - field name is "file"
  - supported extensions are .txt, .png and .mp4
    - files are uploaded to <uploaddir>/<type>/randomname.ext
      - types are t for txt, i for png and v for mp4
- body contains public url

#### Status codes
- /upload/
  - 201 - File upload successful
  - 400 - Missing file to upload
  - 401 - Invalid upload token
  - 500 - Error while processing file
  - Body is "error" on all errors (400, 401, 500)