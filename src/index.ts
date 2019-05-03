import Koa from "koa";
import Router from "koa-router";
import Bodyparser from "koa-bodyparser";
import {
  gantryDoesNotExistResponse,
  unauthorizationResponse,
  badRequestResponse,
  userNotFoundResponse
} from "./models/error";
import {
  createConnection,
  ConnectionOptions,
  getConnection,
  getRepository
} from "typeorm";
import connectionDetails from "../ormconfig.json";
import { Gantry } from "./models/gantry";
import { Passage } from "./models/passage";
import { User } from "./models/user";
import { Invoice } from "./models/invoice";

(async () => {
  await createConnection(connectionDetails as ConnectionOptions);
  await getConnection();
  const app = new Koa();
  const router = new Router();

  app.use(Bodyparser()).use(router.routes());

  const token = "fhsakdjhjkfds";

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

    const position = ctx.request.body.position;
    const gantryRepo = await getRepository(Gantry);
    const gantry = await gantryRepo.findOne({ id: ctx.params.id });
    if (!gantry) {
      ctx.status = 404;
      ctx.body = gantryDoesNotExistResponse;
      return;
    }

    const updatedGantry = await gantryRepo.save({
      ...gantry,
      latitude: position[0],
      longitude: position[1],
      lastUpdate: new Date()
    });

    ctx.status = 200;
    ctx.body = updatedGantry;
  });

  router.get("/gantries", async (ctx, _next) => {
    ctx.status = 200;
    ctx.body = await getRepository(Gantry).find();
  });

  router.post("/passages", async (ctx, _next) => {
    if (ctx.headers.authorization !== `Bearer ${token}`) {
      ctx.status = 401;
      ctx.body = unauthorizationResponse;
      return;
    }
    if (!ctx.request.body.personalId || !ctx.request.body.gantryId) {
      ctx.status = 400;
      ctx.body = badRequestResponse;
      return;
    }
    const gantry = await getRepository(Gantry).findOne({
      id: ctx.request.body.gantryId
    });
    if (!gantry) {
      ctx.status = 400;
      ctx.body = badRequestResponse;
      return;
    }
    const newPassage = {
      user: ctx.request.body.personalId,
      gantry,
      latitude: gantry.latitude,
      longitude: gantry.longitude,
      time: new Date(),
      price: gantry.price
    };

    await getRepository(Passage).save(newPassage);

    ctx.status = 200;
    ctx.body = newPassage;
  });

  router.get("/invoices", async (ctx, _next) => {
    if (ctx.headers.authorization !== `Bearer ${token}`) {
      ctx.status = 401;
      ctx.body = unauthorizationResponse;
      return;
    }
    const userInvoices = await getRepository(Invoice).find({
      user: ctx.query.personalId
    });
    ctx.status = 200;
    ctx.body = userInvoices;
  });

  router.get("/passages", async (ctx, _next) => {
    if (ctx.headers.authorization !== `Bearer ${token}`) {
      ctx.status = 401;
      ctx.body = unauthorizationResponse;
      return;
    }

    const user = await getRepository(User).findOne({
      personalIdNumber: ctx.query.personalId
    });
    if (!user) {
      ctx.status = 404;
      ctx.body = userNotFoundResponse;
      return;
    }

    const userPassages = await getRepository(Passage).find({ user });

    ctx.status = 200;
    ctx.body = userPassages;
  });

  app.listen(3000);
  console.log("Started server");
})();
