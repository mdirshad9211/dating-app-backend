module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["./tests/setup.js"],
  moduleNameMapper: {
    '^node:(.*)$': '$1',
  },
};
