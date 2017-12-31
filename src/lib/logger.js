'use strict';
const log4js = require('log4js');
const path = require('path');
log4js.configure(path.join(__dirname, './log4js_config.json'));

const logger = log4js.getLogger();
// logger.info('AAAA');

module.exports = logger;