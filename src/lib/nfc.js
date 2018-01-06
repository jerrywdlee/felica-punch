'use strict';
const NfcpyId = require('node-nfcpy-id').default;
const nfc = new NfcpyId().start();

console.log('Service Started');

nfc.on('error', (err) => {
  console.error(err);
});

module.exports = nfc;