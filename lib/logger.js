/*
 * custom logger
 *  use by calling log.info, log.warn, log.error, exposed globally
 *  log files will be split for each day
 */

const config = require('../config.js')
const logger = require('simple-node-logger');
const manager = new logger();
const opts = {
  logDirectory: './logs',
  fileNamePattern: '<DATE>.log',
  dateFormat: 'YYYY-MM-DD',
};
manager.createConsoleAppender();
manager.createRollingFileAppender(opts);

global.log = manager.createLogger();
log.setLevel(config.logLevel);