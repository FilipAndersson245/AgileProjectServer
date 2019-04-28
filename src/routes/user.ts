import { getConnection } from "typeorm";

import Router from "koa-router";

const router = new Router({ prefix: "/users" });

interface IUser {
  personalId: number;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
}

export const validatePersonalId = (personalId: number) => {
  const personalIdLength = personalId.toString().length;
  if (personalIdLength !== 10 && personalIdLength !== 12) {
    return false;
  }
  return true;
};

export const validateEmail = (email: string) => {
  if (!/\S+@\S+\.\S+/.test(email)) {
    return false;
  }
  return true;
};

export const validatePassword = (password: string) => {
  if (!/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.{5,})/.test(password)) {
    return false;
  }
  return true;
};

export const validateUserRequest = (user: IUser) => {
  if (!user.address || !user.firstName || !user.lastName) {
    return false;
  }
  if (validateEmail(user.email)) {
    return false;
  }
  if (validatePassword(user.password)) {
    return false;
  }
  if (validatePersonalId(user.personalId)) {
    return false;
  }
  return true;
};

router.post("/", async (ctx, _next) => {
  const user: IUser = ctx.request.body;
  if (validateUserRequest(user)) {
    return;
  }

  getConnection();
});

// router.put("/", (req, res) => {
//   return;
// });

export { router };
