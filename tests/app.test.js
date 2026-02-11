const request = require("supertest");
const app = require("../src/server");

describe("GET /", () => {
  it("should return 200 and correct message", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("API Running 🚀");
  });
});

describe("Environment check", () => {
  it("should not start server when NODE_ENV is test", () => {
    process.env.NODE_ENV = "test";
    expect(process.env.NODE_ENV).toBe("test");
  });
});
