const path = require("path");
const { spawnSync } = require("child_process");
const {
  addition,
  subtraction,
  multiplication,
  division,
  calculate,
} = require("../calculator");

describe("calculator arithmetic functions", () => {
  test("addition from example operation (2 + 3)", () => {
    expect(addition(2, 3)).toBe(5);
  });

  test("subtraction from example operation (10 - 4)", () => {
    expect(subtraction(10, 4)).toBe(6);
  });

  test("multiplication from example operation (45 * 2)", () => {
    expect(multiplication(45, 2)).toBe(90);
  });

  test("division from example operation (20 / 5)", () => {
    expect(division(20, 5)).toBe(4);
  });

  test("supports decimal and negative values", () => {
    expect(addition(-1.5, 2)).toBe(0.5);
    expect(subtraction(2, -3)).toBe(5);
    expect(multiplication(-3, 2)).toBe(-6);
    expect(division(-9, 3)).toBe(-3);
  });

  test("division by zero throws an error", () => {
    expect(() => division(10, 0)).toThrow("Division by zero is not allowed.");
  });
});

describe("calculate dispatcher", () => {
  test("accepts word aliases", () => {
    expect(calculate("addition", 2, 3)).toBe(5);
    expect(calculate("subtraction", 10, 4)).toBe(6);
    expect(calculate("multiplication", 45, 2)).toBe(90);
    expect(calculate("division", 20, 5)).toBe(4);
  });

  test("accepts symbol aliases", () => {
    expect(calculate("+", 2, 3)).toBe(5);
    expect(calculate("-", 10, 4)).toBe(6);
    expect(calculate("*", 45, 2)).toBe(90);
    expect(calculate("/", 20, 5)).toBe(4);
  });

  test("throws on invalid operation", () => {
    expect(() => calculate("power", 2, 3)).toThrow('Invalid operation: "power"');
  });
});

describe("CLI behavior", () => {
  const scriptPath = path.resolve(__dirname, "../calculator.js");

  test("prints result and exits with code 0 for a valid operation", () => {
    const result = spawnSync("node", [scriptPath, "+", "2", "3"], { encoding: "utf8" });
    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe("5");
    expect(result.stderr.trim()).toBe("");
  });

  test("returns error for division by zero", () => {
    const result = spawnSync("node", [scriptPath, "/", "10", "0"], { encoding: "utf8" });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Division by zero is not allowed.");
  });

  test("returns error for invalid numeric input", () => {
    const result = spawnSync("node", [scriptPath, "+", "abc", "2"], { encoding: "utf8" });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Invalid input: operands must be valid numbers.");
  });
});
