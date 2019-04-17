import app from "./index";
import request from "supertest";
import {
  gantryDoesNotExistResponse,
  unauthorizationResponse,
  badRequestResponse
} from "./models/error";

afterEach(() => {
  app.close();
});

describe("Update gantry position test", () => {
  const goodId = "abc123";
  const badId = "jkl345";

  const goodBody = {
    position: [3.213134, 12.438324]
  };
  const token = "fhsakdjhjkfds";

  test("Should send data correctly", async () => {
    const response = await request(app)
      .post(`/gantries/${goodId}`)
      .auth(token, { type: "bearer" })
      .send(goodBody);

    expect(response.status).toEqual(200);
    expect(response.type).toEqual("application/json");
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.stringMatching(goodId),
        position: expect.any(Object),
        lastUpdated: expect.any(Number),
        price: expect.any(Number)
      })
    );
  });

  test("Should send to non-existing gantry", async () => {
    const response = await request(app)
      .post(`/gantries/${badId}`)
      .auth(token, { type: "bearer" })
      .send(goodBody);

    expect(response.status).toEqual(404);
    expect(response.type).toEqual("application/json");
    expect(response.body).toEqual(gantryDoesNotExistResponse);
  });

  test("Should be unauthorized", async () => {
    const response = await request(app)
      .post(`/gantries/${goodId}`)
      .auth("jhkfdskjhfsdfsdih", { type: "bearer" })
      .send(goodBody);
    expect(response.status).toEqual(401);
    expect(response.type).toEqual("application/json");
    expect(response.body).toEqual(unauthorizationResponse);
  });
});

describe("Returns json data about multiple gantries", () => {
  const goodId = "abc123";

  test("Should get data correctly", async () => {
    const response = await request(app).get(`/gantries`);

    expect(response.status).toEqual(200);
    expect(response.type).toEqual("application/json");

    expect(Array.isArray(response.body)).toBe(true);

    if (response.body.length > 0) {
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.stringMatching(goodId),
            position: expect.any(Object),
            lastUpdated: expect.any(Number),
            price: expect.any(Number)
          })
        ])
      );
    }
  });
});

describe("Tests passages", () => {
  const goodId = "abc123";
  const badId = "jkl345";

  const goodBody = {
    userId: 199308161337,
    gantryId: goodId
  };
  const badBody = {
    userId: 199308161337,
    gantryId: badId
  };
  const token = "fhsakdjhjkfds";

  test("Should post passage correcly", async () => {
    const response = await request(app)
      .post(`/passages`)
      .auth(token, { type: "bearer" })
      .send(goodBody);

    expect(response.status).toEqual(200);
    expect(response.type).toEqual("application/json");

    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        userId: expect.any(Number),
        gantryId: expect.stringMatching(goodId),
        position: expect.any(Object),
        time: expect.any(Number),
        price: expect.any(Number)
      })
    );
  });

  test("Should perform a bad request", async () => {
    const response = await request(app)
      .post(`/passages`)
      .auth(token, { type: "bearer" })
      .send(badBody);

    expect(response.status).toEqual(400);
    expect(response.type).toEqual("application/json");
    expect(response.body).toEqual(badRequestResponse);
  });

  test("Should be unauthorized", async () => {
    const response = await request(app)
      .post(`/passages`)
      .auth("jhkfdskjhfsdfsdih", { type: "bearer" })
      .send(goodBody);
    expect(response.status).toEqual(401);
    expect(response.type).toEqual("application/json");
    expect(response.body).toEqual(unauthorizationResponse);
  });
});

describe("Invoices", async () => {
  const userId = "199301201337";
  const authenticationToken = "fhsakdjhjkfds";
  test("Should get invoices", async () => {
    const response = await request(app)
      .get(`/invoices?personalId=${userId}`)
      .auth(authenticationToken, { type: "bearer" })
      .send();
    expect(response.status).toEqual(200);
    expect(response.type).toEqual("application/json");

    expect(Array.isArray(response.body)).toBe(true);
    if (response.body.length > 0) {
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            amount: expect.any(Number),
            firstName: expect.any(String),
            lastName: expect.any(String),
            address: expect.any(String),
            personalId: expect.any(Number),
            issuedAt: expect.any(Number),
            dueDate: expect.any(Number),
            paid: expect.any(Boolean)
          })
        ])
      );
    }
  });

  test("should not be authorized", async () => {
    const response = await request(app)
      .get(`/invoices?personalId=${userId}`)
      .auth(`${authenticationToken}abc`, { type: "bearer" })
      .send();
    expect(response.status).toEqual(401);
    expect(response.type).toEqual("application/json");
  });
});
