const request = require("supertest");

const app = require("../server");

let token = "";

beforeAll(async () => {

  await request(app)
    .post("/api/auth/register")
    .send({
      username: "roomuser",
      email: "room@test.com",
      password: "123456"
    });

  const login =
    await request(app)
      .post("/api/auth/login")
      .send({
        email: "room@test.com",
        password: "123456"
      });

  token =
    login.body.token;

});

describe("Room API", () => {

  test(
    "Create room",
    async () => {

      const response =
        await request(app)
          .post("/api/rooms")
          .set(
            "Authorization",
            `Bearer ${token}`
          )
          .send({
            name: "Testing Room"
          });

      expect(
        response.statusCode
      ).toBe(201);

    }
  );

});