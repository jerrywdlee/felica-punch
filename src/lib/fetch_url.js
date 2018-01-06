'use strict';
const r2 = require('r2');

class Fetch {
  constructor(url) {
    this.url = url;
  }
  
  async post(data) {
    // console.log(this.url, data);
    const res = await r2.post(this.url, { json: data }).text;
    return res;
  }

  async get() {
    const res = await r2.get(this.url).text;
    return res;
  }
}

module.exports = Fetch;