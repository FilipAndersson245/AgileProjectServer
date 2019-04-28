import { validatePersonalId, validateEmail } from "./user";

describe("validatePersonalId", async () => {
  it("Should fail, to long id", async () => {
    const id = 12345678946914564;
    expect(validatePersonalId(id)).toBeFalsy();
  });

  it("Should fail, to short id", async () => {
    const id = 12687;
    expect(validatePersonalId(id)).toBeFalsy();
  });

  it("Should succeed, short id", async () => {
    const id = 8901023286;
    expect(validatePersonalId(id)).toBeTruthy();
  });

  it("Should succeed, long id", async () => {
    const id = 198901023286;
    expect(validatePersonalId(id)).toBeTruthy();
  });
});

describe("validate email", async () => {
  it("Should fail, bad email", async () => {
    const email = "abc.com";
    expect(validateEmail(email)).toBeFalsy();
  });

  it("Should succeed, good email", async () => {
    const email = "abc@mail.com";
    expect(validateEmail(email)).toBeTruthy();
  });
});

describe("validate password", async () => {
  it("Should fail, bad password to short", async () => {
    const password = "abc123";
    expect(validateEmail(password)).toBeFalsy();
  });

  it("Should fail, bad password no digits", async () => {
    const password = "abcdefghijk";
    expect(validateEmail(password)).toBeFalsy();
  });

  it("Should succeed, good password", async () => {
    const password = "abc123456";
    expect(validateEmail(password)).toBeTruthy();
  });
});
