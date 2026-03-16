module.exports = {
  preset: "jest-preset-angular",
  setupFilesAfterFramework: ["<rootDir>/setup-jest.ts"],
  testPathPattern: ["projects/.*\\.spec\\.ts$"],
  transform: {
    "^.+\\.(ts|mjs|js|html)$": [
      "jest-preset-angular",
      {
        tsconfig: "<rootDir>/tsconfig.spec.json",
        stringifyContentPathRegex: "\\.html$",
      },
    ],
  },
};
