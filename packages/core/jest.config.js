const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  moduleNameMapper:{
    "^@repo/(.*)$": "<rootDir>/../$1",
    "@/tests/(.*)": "<rootDir>/tests/$1",
  }
};