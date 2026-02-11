const request = require("supertest");
const { app, startServer } = require("../src/server");

describe("GET /", () => {
  it("should return 200 and correct message", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("API Running 🚀");
  });
});

describe("Server startup", () => {
  it("should start server when called", () => {
    const server = startServer();
    expect(server).toBeDefined();
    server.close();
  });
});
