import app from "./index";
import request from "supertest";
import {
  gantryDoesNotExistResponse,
  unauthorizationResponse
} from "./models/error";

afterEach(() => {
  app.close();
});

const goodId = "abc123";
const badId = "jkl345";

const goodBody = {
  position: [3.213134, 12.438324]
};
const token = "fhsakdjhjkfds";

describe("Update gantry position test", () => {
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
