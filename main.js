'use strict';
const electron = require("electron");
const path = require('path');
const YAML = require('yamljs');
const cron = require('node-cron');

const app = electron.app;
const server = require('./src/lib/server');
const nfc = require('./src/lib/nfc');
const Fetch = require('./src/lib/fetch_url');
const config = YAML.load(path.join(__dirname, './conf.yml'));
const punch = new Fetch(config.host + config.urls.punch, config.device_uid);
const heartBeat = new Fetch(config.host + config.urls.heart_beat);

const BrowserWindow = electron.BrowserWindow;

let mainWindow;
let lastTouched = Date.now();

app.on('ready', async () => {
  mainWindow = new BrowserWindow({ 
    width: 1024, height: 600, 
    // kiosk: true, 
    fullscreen: true, 
    frame: false
  });
  try {
    const url = await server.getUrl();
    
    console.log(url);
    mainWindow.loadURL(url);

    server.socket.on('connection', async (socket) => {
      await heartBeat.get();
      socket.emit('connected', { status: 'connected', server: config.host });
      socket.on('close_app', () => {
        // console.log('close_app');
        app.quit();
      });
    });
    
    nfc.on('touchstart', async (card) => {
      console.log('touchstart', 'id:', card.id, 'type:', card.type);
      const { id, type } = card;
      const now = Date.now();
      if (now - lastTouched > 250) {
        lastTouched = now;
        let res = await punch.post({ card_uid: id, card_type: type });
        console.log(res);
        server.emit(res);
      } else {
        let res = { error: 'Card Error!', card_uid: id };
        server.emit(res);
      }
    });
    if (cron.validate(config.heart_beat_cron)) {
      cron.schedule(config.heart_beat_cron, async () => {
        await heartBeat.get();
      });
    }
    /*
    setInterval(async () => {
      await heartBeat.get();
    }, 20 * 60 * 1000);
    */
  } catch (e) {
    console.error(e);
  }
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
});

app.on('window-all-closed', async () => {
  app.quit();
  /*
  if (process.platform != 'darwin') {
    app.quit();
  }
  */
});

const delay = (ms) => new Promise(resolve => {
  setTimeout(resolve, ms);
});