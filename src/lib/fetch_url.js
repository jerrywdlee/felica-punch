'use strict';
const r2 = require('r2');

class Fetch {
  constructor(url) {
    this.url = url;
  }
  
  async post(data) {
    const res = await r2.post(this.url, { json: data }).text;
    return res;
  }
}

module.exports = Fetch;