'use strict';

const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static');
const path = require('path');
const fs = require('fs');
const app = new Koa();
const router = new Router();
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);
const aport = require('aport');

app
  .use(logger)
  // .use(serve(path.join(__dirname, '../public')))
  .use(router.routes())
  .use(router.allowedMethods())
aport().then(port => server.listen(port)); // listen ephemeral port

router.get('/', async (ctx, next) => {
  let html = fs.readFileSync(path.join(__dirname, '../../public/index.html')).toString();
  html = html.replace(`io.connect('http://localhost:3033');`, `io.connect('${await getUrl()}');`);
  ctx.body = html;
});

async function getUrl() {
  const port = server.address().port;
  return `http://localhost:${port}`;
}

io.on('connection', function (socket) {
  // socket.emit('connected', { hello: 'world' });
});

function emit(data, eventName = 'punched') {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
  }
  io.emit(eventName, data);
}

// logger
async function logger(ctx, next) {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
}

module.exports = app;
app.emit = emit;
app.socket = io;
app.getUrl = getUrl;
// app.getPort = getPort;