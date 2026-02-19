const request = require("supertest");
const app = require("../src/app");

describe("GET /heath", () => {
  it("should return 200 and correct message", async () => {
    const res = await request(app).get("/heath");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Server is healthy" });
  });
});
