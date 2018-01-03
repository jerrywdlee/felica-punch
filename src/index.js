#!/usr/bin/env node

'use strict';
const NfcpyId = require('node-nfcpy-id').default;
const nfc = new NfcpyId().start();
// const nfc = new NfcpyId({ scriptPath: __dirname, scriptFile: './lib/reader.py' }).start();
const Fetch = require('./lib/fetch_url');
const log4js = require('./lib/logger');
const path = require('path');
const YAML = require('yamljs');
const config = YAML.load(path.join(__dirname, '../conf.yml'));
const f = new Fetch(config.host + config.urls.punch);

log4js.info('Service Started');

nfc.on('touchstart', async (card) => {
  log4js.info('touchstart', 'id:', card.id, 'type:', card.type);
  // { type: 3, event: 'touchstart', id: '01010310xxxxx' }
  // console.log(card);
  const { id, type } = card;
  const res = await f.post({ card_uid: id, card_type: type });
  log4js.info(res);
});

nfc.on('touchend', (card) => {
  log4js.info('touchend');
  // { event: 'touchend' }
  // console.log(card);
});

nfc.on('error', (err) => {
  // standard error output (color is red)
  log4js.error(err);
});

// const server = require('./page/server');