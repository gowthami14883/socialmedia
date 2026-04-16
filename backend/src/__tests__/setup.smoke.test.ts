describe("backend jest setup", () => {
  it("loads global mocks without treating the setup file as a test", () => {
    const dotenv = require("dotenv");

    expect(jest.isMockFunction(dotenv.config)).toBe(true);
  });
});
