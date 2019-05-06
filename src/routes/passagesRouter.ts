import Router from "koa-router";
import { getRepository } from "typeorm";
import { Passage } from "../models/passage";
import { token } from "..";
import {
  unauthorizationResponse,
  badRequestResponse,
  userNotFoundResponse
} from "../models/error";
import { Gantry } from "../models/gantry";
import { User } from "../models/user";

const passagesRouter = new Router({ prefix: "/passages" });

passagesRouter.post("/", async (ctx, _next) => {
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

passagesRouter.get("/", async (ctx, _next) => {
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

export default passagesRouter;
