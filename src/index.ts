import Koa from "koa";
import Router from "koa-router";
import Bodyparser from "koa-bodyparser";
import {
  gantryDoesNotExistResponse,
  unauthorizationResponse,
  badRequestResponse,
  userNotFoundResponse
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

export let passages = [
  {
    id: 0,
    personalId: 199301201337,
    gantryId: "abc123",
    position: [5.927545, 1.372983],
    time: 1554198125,
    price: 120
  }
];

let users = [
  { 
    personalId: 199301201337,
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@gmail.com",
    address: "Coolstreet 8 56912 Jönköping Sweden"
  }
]

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

router.post("/passages", async (ctx, _next) => {
  if (ctx.headers.authorization !== `Bearer ${token}`) {
    ctx.status = 401;
    ctx.body = unauthorizationResponse;
    return;
  }
  if (!ctx.request.body.userId || !ctx.request.body.gantryId) {
    ctx.status = 400;
    ctx.body = badRequestResponse;
    return;
  }
  const gantry = gantries.find((item) => item.id === ctx.request.body.gantryId);
  if (!gantry) {
    ctx.status = 400;
    ctx.body = badRequestResponse;
    return;
  }
  const newPassage = {
    id: passages.length,
    personalId: ctx.request.body.personalId,
    gantryId: gantry.id,
    position: gantry.position,
    time: Date.now(),
    price: gantry.price
  };
  passages = [...passages, newPassage];
  ctx.status = 200;
  ctx.body = newPassage;
});

router.get("/passages", async (ctx, _next) => {
  if (ctx.headers.authorization !== `Bearer ${token}`) {
    ctx.status = 401;
    ctx.body = unauthorizationResponse;
    return;
  }
  if(!users.find((user) => user.personalId === parseInt(ctx.query.personalId)))
  {
    ctx.status = 404;
    ctx.body = userNotFoundResponse;
    return;
  }
  const userPassages = passages.filter((passage) => passage.personalId === ctx.query.personalId);

  ctx.status = 200;
  ctx.body = userPassages;
});

const server = app.listen(3000);

export default server;
