import Koa from "koa";
import Router from "koa-router";
import Bodyparser from "koa-bodyparser";
import { createConnection, ConnectionOptions, getConnection } from "typeorm";
import connectionDetails from "../ormconfig.json";
import gantriesRouter from "./routes/gantriesRouter";
import passagesRouter from "./routes/passagesRouter";
import invoicesRouter from "./routes/invoicesRouter";

export const token = "fhsakdjhjkfds";

(async () => {
  await createConnection(connectionDetails as ConnectionOptions);
  await getConnection();
  const app = new Koa();
  const router = new Router();

  app.use(Bodyparser()).use(router.routes());
  app.use(gantriesRouter.routes());
  app.use(passagesRouter.routes());
  app.use(invoicesRouter.routes());

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

  app.listen(3000);
  console.log("Started server");
})();
