# screen.sbs
## Server
### Self-hosted image, video and code/text sharing
[Demo](https://screen.sbs) (no public uploads)
<br>
<br>

#### Requirements
- NodeJS (16-ish)
<br>

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

<br>

#### Upload

- Use screen.sbs clients
  - [Windows](https://github.com/screen-sbs/client-windows)
  - [Linux](https://github.com/screen-sbs/client-linux)
  - Web form on ```/upload/```
- post file to ```/upload```
  - field name is "file"
  - supported extensions are .txt, .png and .mp4
    - files are uploaded to ```<uploaddir>/<type>/randomname.ext```
      - types are t for txt, i for png and v for mp4
  - body contains public url
  - token must be set on one of the following options
    - ```/upload/<token>```
    - ```/upload?token=<token>```
    - field with name token
  
- Some server config values are exposed on /config
  - fileSizeLimit
    - Max. file size in MB
  - fileNameLength
    - Length of random file names the server generates

##### Status codes
- 201 - File upload successful
- 400 - Missing file to upload
- 401 - Invalid upload token
- 413 - File size exceeds limit
- 500 - Error while processing file
- Body is "error" on all errors (400, 401, 500)