import Router from "koa-router";
import { sign } from "jsonwebtoken";
import { getRepository } from "typeorm";
import { sqlpromiseHandler } from "../db";
import { User } from "../models/user";
import { compare } from "bcrypt";

const sessionRouter = new Router({ prefix: "/sessions" });

sessionRouter.post("/", async (ctx, _next) => {
  const username: string = ctx.request.body.username;
  const password: string = ctx.request.body.password;
  const grantType: string = ctx.request.body.grant_type;
  if (!username || !password || !grantType) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Missing parameters!" };
    return;
  }
  if (grantType !== "password") {
    ctx.response.status = 400;
    ctx.response.body = { error: "Grant type not supported!" };
    return;
  }
  // const querya = getRepository(User)
  //   .createQueryBuilder("user")
  //   .select()
  //   .where("user.personal_id_number = :a", { username })
  //   .getOne();
  const query = getRepository(User).findOne(username);

  const { data, error } = await sqlpromiseHandler(query);
  if (error) {
    console.log(error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error!" };
    return;
  }
  if (!data) {
    ctx.response.status = 404;
    ctx.response.body = { error: "Account does not exist!" };
    return;
  }
  if (await compare(password, data!.password as string)) {
    const token = sign(
      { sub: data!.personalIdNumber },
      process.env.TOKEN_SECRET!,
      {
        expiresIn: "5 days"
      }
    );
    ctx.response.status = 200;
    ctx.response.body = { auth: true, token };
    return;
  } else {
    ctx.response.status = 401;
    ctx.response.body = { error: "Bad login attempt!" };
  }
});

export default sessionRouter;
