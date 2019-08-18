const fs = require('fs');
const Koa = require('koa');
const send = require('koa-send');
const Router = require('koa-router');
const logger = require('koa-logger');
const routes = require('./routes');
const app = new Koa();
const apiRouter = new Router({
  prefix: '/api'
});

app.use(logger());
app.use(async (ctx, next) => {
  await next();
  if (ctx.status === 404) {
    await send(ctx, '/index.html', { root: __dirname + '/public' });
  }
});
app.use(async (ctx, next) => {
  await next();
  if (ctx.path.split('/')[1] !== 'api') {
    if (fs.existsSync(__dirname + '/public' + ctx.path)) {
      await send(ctx, ctx.path, { root: __dirname + '/public' });
    }
  }
});
routes(apiRouter);
app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());
const server = app.listen(3000);
module.exports = server;
