module.exports = {
  testEnvironment: "node",
  globalSetup: "./tests/jest-setup.js",
  setupFilesAfterEnv: ["./tests/setup.js"],
};
