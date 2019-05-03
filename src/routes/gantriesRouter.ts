import Router from "koa-router";
import {
  unauthorizationResponse,
  gantryDoesNotExistResponse
} from "../models/error";
import { getRepository } from "typeorm";
import { Gantry } from "../models/gantry";
import { token } from "..";

const gantriesRouter = new Router({ prefix: "/gantries" });

gantriesRouter.post("/:id", async (ctx, _next) => {
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

gantriesRouter.get("/", async (ctx, _next) => {
  ctx.status = 200;
  ctx.body = await getRepository(Gantry).find();
});

export default gantriesRouter;
