import Koa from "koa";
import Router from "koa-router";

const app = new Koa();
const router = new Router();

app.use(router.routes());

// logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get("X-Response-Time");
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set("X-Response-Time", `${ms}ms`);
});

// response
router.get("/name/:name", async (ctx, _next) => {
  console.log(ctx.params.name);
  ctx.body = `Hello ${ctx.params.name}`;
});

app.listen(3000);
