import Router from "koa-router";
import { getRepository } from "typeorm";
import { Invoice } from "../models/invoice";
import { authenticateAndRespondWithMessages } from "../authentication";

const invoicesRouter = new Router({ prefix: "/invoices" });

invoicesRouter.get("/", async (ctx, _next) => {
  if (!authenticateAndRespondWithMessages(ctx, ctx.query.personalId)) {
    return;
  }
  const userInvoices = await getRepository(Invoice).find({
    userId: ctx.query.personalId
  });
  ctx.status = 200;
  ctx.body = userInvoices;
});

export default invoicesRouter;
