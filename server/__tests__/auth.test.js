const request = require("supertest");

const app = require("../server");

describe("Auth API", () => {

  test(
    "Register user",
    async () => {

      const response =
        await request(app)
          .post("/api/auth/register")
          .send({
            username: "testuser",
            email: "test@test.com",
            password: "123456"
          });

      expect(
        response.statusCode
      ).toBe(201);

    }
  );

  test(
    "Login user",
    async () => {

      const response =
        await request(app)
          .post("/api/auth/login")
          .send({
            email: "test@test.com",
            password: "123456"
          });

      expect(
        response.statusCode
      ).toBe(200);

      expect(
        response.body.token
      ).toBeDefined();

    }
  );

});