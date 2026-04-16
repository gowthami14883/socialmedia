



const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} */

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["<rootDir>/src/__tests__/jest.setup.js"],
  testPathIgnorePatterns: [
    "<rootDir>/src/__tests__/jest.setup.ts",
    "<rootDir>/src/__tests__/jest.setup.js",
  ],

  transform: {
    ...tsJestTransformCfg,
  },

  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",   // 🔥 IMPORTANT FIX
  },
};















