const request = require("supertest");
const app = require("../src/app");

const describeDb = global.SKIP_DB_TESTS === "true" ? describe.skip : describe;

describeDb("Authentication Integration Tests", () => {
  const user = {
    email: "test@example.com",
    password: "password123",
  };

  describe("Register", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("/api/auth/register").send(user);

      expect(res.statusCode).toBe(201);
      expect(res.body.user.email).toBe(user.email);
      expect(res.body.user.id).toBeDefined();
    });

    it("should not allow duplicate email", async () => {
      await request(app).post("/api/auth/register").send(user);

      const res = await request(app).post("/api/auth/register").send(user);

      expect(res.statusCode).toBe(409);
    });
  });

  describe("Login", () => {
    it("should login successfully and return tokens", async () => {
      await request(app).post("/api/auth/register").send(user);

      const res = await request(app).post("/api/auth/login").send(user);

      expect(res.statusCode).toBe(200);
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.refreshToken).toBeDefined();
    });

    it("should reject invalid password", async () => {
      await request(app).post("/api/auth/register").send(user);

      const res = await request(app).post("/api/auth/login").send({
        email: user.email,
        password: "wrongpassword",
      });

      expect(res.statusCode).toBe(401);
    });
  });

  describe("Refresh Token", () => {
    it("should refresh access token", async () => {
      await request(app).post("/api/auth/register").send(user);

      const loginRes = await request(app).post("/api/auth/login").send(user);

      const refreshRes = await request(app)
        .post("/api/auth/refresh")
        .send({ refreshToken: loginRes.body.refreshToken });

      expect(refreshRes.statusCode).toBe(200);
      expect(refreshRes.body.accessToken).toBeDefined();
      expect(refreshRes.body.refreshToken).toBeDefined();
    });
  });
});
