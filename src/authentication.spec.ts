import { authenticateHeader, verifyIdentity } from "./authentication";
import { sign } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config(); // Load .env to process.env object

describe("Authentication header", async () => {
  it("Should be validate correctly", async () => {
    const a = JSON.stringify({
      sub: "foo"
    });
    const b = `Bearer ${sign(a, process.env.TOKEN_SECRET!)}`;

    expect(authenticateHeader(b)).toBeTruthy();
  });

  it("Should not be validate correctly", async () => {
    const a = JSON.stringify({
      sub: "foo"
    });
    const b = `Bearer ${sign(a, process.env.TOKEN_SECRET + "42"!)}`;

    expect(authenticateHeader(b)).toBeFalsy();
  });
});

describe("verifyIdentity", async () => {
  it("Should be validate correctly", async () => {
    const a = {
      sub: "foo"
    };

    // tslint:disable-next-line:no-any
    expect(verifyIdentity(a.sub, a as any)).toBeTruthy();
  });

  it("Should be be false with bad id", async () => {
    const a = {
      sub: "foo"
    };

    // tslint:disable-next-line:no-any
    expect(verifyIdentity("bar", a as any)).toBeFalsy();
  });
});
