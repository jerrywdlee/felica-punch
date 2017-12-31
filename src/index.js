#!/usr/bin/env node

'use strict';
const NfcpyId = require('node-nfcpy-id').default;
const nfc = new NfcpyId().start();
// const nfc = new NfcpyId({ scriptPath: __dirname, scriptFile: './lib/reader.py' }).start();
const Fetch = require('./lib/fetch_url');
const path = require('path');
const YAML = require('yamljs');
const config = YAML.load(path.join(__dirname, '../conf.yml'));
const f = new Fetch(config.host + config.urls.punch);

nfc.on('touchstart', (card) => {
  console.log('touchstart', 'id:', card.id, 'type:', card.type);
  // { type: 3, event: 'touchstart', id: '01010310xxxxx' }
  // console.log(card);
  const { id, type } = card;
  f.post({ id, type });
});

nfc.on('touchend', (card) => {
  console.log('touchend');
  // { event: 'touchend' }
  // console.log(card);
});

nfc.on('error', (err) => {
  // standard error output (color is red)
  console.error('\u001b[31m', err, '\u001b[0m');
});

const server = require('./page/server');