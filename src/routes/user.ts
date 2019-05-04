import Router from "koa-router";
import { User } from "../models/user";
import { getConnection } from "typeorm";
import { authenticateAndRespondWithMessages } from "../authentication";

const userRouter = new Router({ prefix: "/users" });

export const validatePersonalId = (personalId: number) => {
  const personalIdLength = personalId.toString().length;
  return personalIdLength === 10 || personalIdLength === 12;
};

export const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

export const validatePassword = (password: string) =>
  /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.{5,})/.test(password);

export const validateUserRequest = (user: User) => {
  return !user.address ||
    !user.firstName ||
    !user.lastName ||
    validateEmail(user.email) ||
    validatePassword(user.password as string) ||
    validatePersonalId(user.personalIdNumber)
    ? false
    : true;
};

userRouter.post("/", async (ctx, _next) => {
  const token = authenticateAndRespondWithMessages(ctx.request, ctx.response);
  if (!token) return;

  const user: User = ctx.request.body;
  if (validateUserRequest(user)) {
    ctx.response.body = { error: "Invalid request parameters" };
    return;
  }

  await getConnection()
    .getRepository(User)
    .insert(user);
});

export default userRouter;
