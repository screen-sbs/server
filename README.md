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