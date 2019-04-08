import Koa from "koa";
import Router from "koa-router";
import Bodyparser from "koa-bodyparser";
import {
  gantryDoesNotExistResponse,
  unauthorizationResponse
} from "./models/error";

const app = new Koa();
const router = new Router();

app.use(Bodyparser()).use(router.routes());

const token = "fhsakdjhjkfds";

// tslint:disable-next-line:prefer-const
// tslint:disable-next-line:no-any
export let gantries = [
  {
    id: "abc123",
    position: [0, 0],
    lastUpdated: 1554198125,
    price: 3.5
  }
];

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

router.post("/gantries/:id", async (ctx, _next) => {
  if (ctx.headers.authorization !== `Bearer ${token}`) {
    ctx.status = 401;
    ctx.body = unauthorizationResponse;
    return;
  }
  const gantryIndex = gantries.findIndex((item) => item.id === ctx.params.id);
  // -1 equals not found with findIndex.
  if (gantryIndex === -1) {
    ctx.status = 404;
    ctx.body = gantryDoesNotExistResponse;
    return;
  }
  gantries[gantryIndex] = {
    ...gantries[gantryIndex],
    position: ctx.request.body.position
  };
  ctx.status = 200;
  ctx.body = gantries[gantryIndex];
});

router.get("/gantries", async (ctx, _next) => {
  ctx.status = 200;
  ctx.body = gantries;
});

const server = app.listen(3000);

export default server;
