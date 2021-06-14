module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  bail: 1,
  verbose: true,
  transform: {
    "^.+\\.[jt]s$": "ts-jest",
  },
};
