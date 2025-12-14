const request = require("supertest");
const app = require("../app");

describe("Auth API", () => {
  it("should register a user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        username: "testuser",
        password: "1234"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User registered");
  });

  it("should login user and return token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        username: "testuser",
        password: "1234"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
