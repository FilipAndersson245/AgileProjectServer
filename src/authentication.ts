import { verify } from "jsonwebtoken";
import { Response, Request } from "koa";

export interface IJwt {
  readonly sub: string;
  readonly iat: number;
  readonly exp: number;
}

/**
 * return the token if its verified against the secret othervise return undefined.
 * @param autenticationHeader This is a string that should start with `Bearer` and contain the token to be validated.
 */
export const authenticateHeader = (autenticationHeader?: string) => {
  if (autenticationHeader && autenticationHeader.startsWith("Bearer ")) {
    const token = autenticationHeader.split(" ")[1];
    try {
      const tokenObj = verify(token, process.env.TOKEN_SECRET!);
      return tokenObj as IJwt;
      // tslint:disable-next-line:no-empty
    } catch (err) {}
  }
  return undefined;
};

/**
 * Verify equility between param.name and tokens name. Must be called after `autenticationHeader`
 * @param id Id sent from the request
 * @param token a valid token.
 */
export const verifyIdentity = (id: string, token?: IJwt) => {
  return token && token.sub === id;
};

/**
 * Verify authentication and return true / false if it is successfully.
 * id also checked be matching if it exists as a parameter.
 * @param req
 * @param res
 * @param id
 */
export const authenticateAndRespondWithMessages = (
  req: Request,
  res: Response,
  id?: string
) => {
  const token = authenticateHeader(req.headers.authorization);
  if (!token) {
    res.status = 401;
    res.body = { errorMessage: "Invalid authentication token format" };
    return;
  }
  if (id) {
    if (!verifyIdentity(id, token)) {
      res.status = 401;
      res.body = { errorMessage: "Unauthorized" };
      return;
    }
  }

  return token;
};
