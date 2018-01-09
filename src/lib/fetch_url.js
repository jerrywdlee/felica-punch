'use strict';
const r2 = require('r2');

class Fetch {
  constructor(url, device_uid) {
    this.url = url;
    this.device_uid = device_uid;
  }
  
  async post(data) {
    // console.log(this.url, data);
    const headers = { "x-device-uid": this.device_uid };
    const res = await r2.post(this.url, { headers, json: data }).text;
    return res;
  }

  async get() {
    const res = await r2.get(this.url).text;
    return res;
  }
}

module.exports = Fetch;