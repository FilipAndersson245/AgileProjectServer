import Router from "koa-router";
import { getRepository } from "typeorm";
import { Passage } from "../models/passage";
import {
  badRequestResponse,
  userNotFoundResponse
} from "../models/error";
import { Gantry } from "../models/gantry";
import { User } from "../models/user";
import { authenticateAndRespondWithMessages } from "../authentication";

const passagesRouter = new Router({ prefix: "/passages" });

passagesRouter.post("/", async (ctx, _next) => {
  if (!authenticateAndRespondWithMessages(ctx, ctx.request.body.personalId)) {
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
    userId: ctx.request.body.personalId,
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
  if (!authenticateAndRespondWithMessages(ctx, ctx.query.personalId)) {
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

  // const userPassages = await getRepository(Passage).find({ user });

  const userPassages = await getRepository(Passage).query(
    `SELECT id, time, price, gantry_id, user_personal_id_number, format(latitude, 6), format(longitude, 6)
    FROM passage WHERE user_personal_id_number = ?;`,
    [user.personalIdNumber]
  );

  ctx.status = 200;
  ctx.body = userPassages;
});

export default passagesRouter;
