'use strict';
const Koa = require('koa');
const Router = require('koa-router');
// const koaStatic = require('koa-static');
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const router = new Router();

const log4js = require('../lib/logger');
const YAML = require('yamljs');
// const config = YAML.load('../../conf');
const PORT = 3030;

app
  .use(logger)
  .use(bodyParser()) // bodyParser must upper than router
  .use(router.routes())
  .use(router.allowedMethods())
  // .use(koaStatic(path.join(__dirname, 'public')))
  .listen(PORT, () => console.log(`Listening on ${PORT}`))

  // logger
async function logger(ctx, next) {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  log4js.info(`${ctx.method} ${ctx.url} - ${ms}ms`);
}

router.post('/api/punch', async (ctx, next) => {
  const data = ctx.request.body;
  log4js.info(data);
  // console.log(data);
  ctx.status = 200;
})

module.exports = app;