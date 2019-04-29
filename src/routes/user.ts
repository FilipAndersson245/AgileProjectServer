import Router from "koa-router";
import { User } from "../models/user";
import { getConnection } from "typeorm";

const router = new Router({ prefix: "/users" });

export const validatePersonalId = (personalId: number) => {
  const personalIdLength = personalId.toString().length;
  return personalIdLength === 10 || personalIdLength === 12;
};

export const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

export const validatePassword = (password: string) =>
  /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.{5,})/.test(password);

export const validateUserRequest = (user: User) => {
  if (
    !user.address ||
    !user.firstName ||
    !user.lastName ||
    validateEmail(user.email) ||
    validatePassword(user.password as string) ||
    validatePersonalId(user.personalIdNumber)
  ) {
    return false;
  }
  return true;
};

router.post("/", async (ctx, _next) => {
  const user: User = ctx.request.body;
  if (validateUserRequest(user)) {
    ctx.response.body = { error: "Invalid request parameters" };
    return;
  }

  const a = await getConnection()
    .getRepository(User)
    .insert(user);
});

export { router };
