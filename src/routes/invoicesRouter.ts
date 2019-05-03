import Router from "koa-router";
import { token } from "..";
import { unauthorizationResponse } from "../models/error";
import { getRepository } from "typeorm";
import { Invoice } from "../models/invoice";

const invoicesRouter = new Router({ prefix: "/invoices" });

invoicesRouter.get("/", async (ctx, _next) => {
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

export default invoicesRouter;
