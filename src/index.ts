import dotenv from "dotenv";
dotenv.config(); // Load .env to process.env object

import Koa from "koa";
import Router from "koa-router";
import Bodyparser from "koa-bodyparser";
import { createConnection, ConnectionOptions, getConnection } from "typeorm";
import connectionDetails from "../ormconfig.json";
import gantriesRouter from "./routes/gantriesRouter";
import passagesRouter from "./routes/passagesRouter";
import invoicesRouter from "./routes/invoicesRouter";
import userRouter from "./routes/user";
import sessionRouter from "./routes/session";

export const token = "fhsakdjhjkfds";

(async () => {
  const port = process.env.PORT || 3000;

  await createConnection(connectionDetails as ConnectionOptions);
  await getConnection();
  const app = new Koa();
  const router = new Router();

  app.use(Bodyparser()).use(router.routes());
  app.use(gantriesRouter.routes());
  app.use(passagesRouter.routes());
  app.use(invoicesRouter.routes());
  app.use(userRouter.routes());
  app.use(sessionRouter.routes());

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

  app.listen(port);
  console.log(`Started server on port ${port}`);
})();
