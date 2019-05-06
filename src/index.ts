import dotenv from "dotenv";
dotenv.config(); // Load .env to process.env object

import Koa from "koa";
import Router from "koa-router";
import Bodyparser from "koa-bodyparser";
import { createConnection, ConnectionOptions, getConnection } from "typeorm";
import gantriesRouter from "./routes/gantriesRouter";
import passagesRouter from "./routes/passagesRouter";
import invoicesRouter from "./routes/invoicesRouter";
import userRouter from "./routes/user";
import sessionRouter from "./routes/session";

export const token = "fhsakdjhjkfds";

(async () => {
  const port = process.env.PORT || 3000;

  try {
    const connectionDetails: ConnectionOptions = await require("../ormconfig.json");
    await createConnection(connectionDetails);
    await getConnection();
  // tslint:disable-next-line:no-empty
  } catch (e) {}

  const app = new Koa();
  const router = new Router();

  if (process.env.NODE_ENV === "development") {
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
  }

  app.use(Bodyparser()).use(router.routes());
  app.use(gantriesRouter.routes());
  app.use(passagesRouter.routes());
  app.use(invoicesRouter.routes());
  app.use(userRouter.routes());
  app.use(sessionRouter.routes());

  app.listen(port);
  console.log(`Started server on port ${port}`);
})();
