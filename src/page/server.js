'use strict';
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const serve = require('koa-static');
const path = require('path');
const app = new Koa();
const router = new Router();
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);

const log4js = require('../lib/logger');
const YAML = require('yamljs');
// const config = YAML.load('../../conf');
const PORT = 3033;

app
  .use(logger)
  .use(serve(path.join(__dirname, './public')))
  .use(bodyParser()) // bodyParser must upper than router
  .use(router.routes())
  .use(router.allowedMethods())
  // .use(koaStatic(path.join(__dirname, 'public')))
  // .listen(PORT, () => console.log(`Listening on ${PORT}`))

server.listen(PORT, () => console.log(`Listening on ${PORT}`));

require("openurl").open(`http://localhost:${PORT}`);

/*
setInterval(function () {
  io.emit('news', { hello: 'world' });
}, 2000);
*/

io.on('connection', function (socket) {

  socket.emit('connected', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

  // logger
async function logger(ctx, next) {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  log4js.info(`${ctx.method} ${ctx.url} - ${ms}ms`);
}

function emit(data, eventName = 'punched') {
  if (typeof data === 'string') {
    data = JSON.parse(data);
  }
  io.emit(eventName, data);
}
/*
router.post('/api/punch', async (ctx, next) => {
  const data = ctx.request.body;
  log4js.info(data);
  // console.log(data);
  ctx.status = 200;
})
*/

module.exports = app;
app.emit = emit;
