import Router from "koa-router";
import { User } from "../models/user";
import { getConnectionManager } from "typeorm";
import { hash } from "bcrypt";
import { sqlpromiseHandler } from "../db";

const userRouter = new Router({ prefix: "/users" });

const hashRounds = 4;

export const validatePersonalId = (personalId: string) => {
  try {
    const numericalPersonalId = parseInt(personalId, 10);
    const personalIdLength = numericalPersonalId.toString().length;
    return personalIdLength === 10 || personalIdLength === 12;
  } catch (e) {
    return false;
  }
};

export const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

export const validatePassword = (password: string) =>
  /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.{5,})/.test(password);

export const validateUserRequest = (user: User) => {
  return user.address &&
    user.firstName &&
    user.lastName &&
    validateEmail(user.email) &&
    validatePassword(user.password as string) &&
    validatePersonalId(user.personalIdNumber)
    ? false
    : true;
};

userRouter.post("/", async (ctx, _next) => {
  const user: User = ctx.request.body;
  if (validateUserRequest(user)) {
    ctx.response.body = { error: "Invalid request parameters" };
    return;
  }
  user.password = await hash(user.password, hashRounds);

  const a = getConnectionManager()
    .get()
    .getRepository(User)
    .insert(user);
  const { error } = await sqlpromiseHandler(a);
  if (error) {
    console.log(error)
    ctx.response.status = 500;
    ctx.response.body = { error: "Failed request" };
    return;
  }
  ctx.response.status = 200;
});

export default userRouter;
