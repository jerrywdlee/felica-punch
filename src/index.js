#!/usr/bin/env node

'use strict';
const NfcpyId = require('node-nfcpy-id').default;
const nfc = new NfcpyId().start();

nfc.on('touchstart', (card) => {
  console.log('touchstart', 'id:', card.id, 'type:', card.type);
  // { type: 3, event: 'touchstart', id: '01010310xxxxx' }
  console.log(card);
});

nfc.on('touchend', (card) => {
  console.log('touchend');
  // { event: 'touchend' }
  console.log(card);
});

nfc.on('error', (err) => {
  // standard error output (color is red)
  console.error('\u001b[31m', err, '\u001b[0m');
});