const request = require("supertest");
const app = require("../app");

let adminToken;
let userToken;
let sweetId;

describe("Sweets API", () => {
  beforeAll(async () => {
    await request(app)
      .post("/api/auth/register")
      .send({ username: "admin_test_1", password: "1234", role: "admin" });

    await request(app)
      .post("/api/auth/register")
      .send({ username: "user_test_1", password: "1234", role: "user" });

    const adminLogin = await request(app)
      .post("/api/auth/login")
      .send({ username: "admin_test_1", password: "1234" });

    adminToken = adminLogin.body.token;

    const userLogin = await request(app)
      .post("/api/auth/login")
      .send({ username: "user_test_1", password: "1234" });

    userToken = userLogin.body.token;
  });

  it("admin can add a sweet", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", adminToken)
      .send({
        name: "Test Sweet",
        category: "Test",
        price: 10,
        quantity: 2
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");

    sweetId = res.body.id;
  });

  it("can fetch sweets list", async () => {
    const res = await request(app)
      .get("/api/sweets")
      .set("Authorization", userToken);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("user can purchase a sweet", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", userToken);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("cannot purchase sweet when out of stock", async () => {
    await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", userToken);

    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", userToken);

    expect(res.body.success).toBe(false);
  });
});
