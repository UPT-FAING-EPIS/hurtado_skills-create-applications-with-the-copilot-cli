const path = require("path");
const { spawnSync } = require("child_process");
const {
  addition,
  subtraction,
  multiplication,
  division,
  modulo,
  power,
  squareRoot,
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

  test("modulo returns remainder", () => {
    expect(modulo(10, 3)).toBe(1);
    expect(modulo(20, 5)).toBe(0);
  });

  test("modulo by zero throws an error", () => {
    expect(() => modulo(10, 0)).toThrow("Modulo by zero is not allowed.");
  });

  test("power returns base raised to exponent", () => {
    expect(power(2, 3)).toBe(8);
    expect(power(5, 0)).toBe(1);
  });

  test("square root returns the root for non-negative values", () => {
    expect(squareRoot(81)).toBe(9);
    expect(squareRoot(0)).toBe(0);
  });

  test("square root throws on negative values", () => {
    expect(() => squareRoot(-1)).toThrow("Square root of a negative number is not allowed.");
  });

  test("extended examples: 5 % 2, 2 ^ 3, sqrt(16)", () => {
    expect(modulo(5, 2)).toBe(1);
    expect(power(2, 3)).toBe(8);
    expect(squareRoot(16)).toBe(4);
  });
});

describe("calculate dispatcher", () => {
  test("accepts word aliases", () => {
    expect(calculate("addition", 2, 3)).toBe(5);
    expect(calculate("subtraction", 10, 4)).toBe(6);
    expect(calculate("multiplication", 45, 2)).toBe(90);
    expect(calculate("division", 20, 5)).toBe(4);
    expect(calculate("modulo", 10, 3)).toBe(1);
    expect(calculate("power", 2, 4)).toBe(16);
    expect(calculate("squareRoot", 64)).toBe(8);
  });

  test("accepts symbol aliases", () => {
    expect(calculate("+", 2, 3)).toBe(5);
    expect(calculate("-", 10, 4)).toBe(6);
    expect(calculate("*", 45, 2)).toBe(90);
    expect(calculate("/", 20, 5)).toBe(4);
    expect(calculate("%", 10, 4)).toBe(2);
    expect(calculate("^", 3, 3)).toBe(27);
    expect(calculate("sqrt", 49)).toBe(7);
  });

  test("throws on invalid operation", () => {
    expect(() => calculate("unknownOperation", 2, 3)).toThrow(
      'Invalid operation: "unknownOperation"'
    );
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

  test("supports modulo from CLI", () => {
    const result = spawnSync("node", [scriptPath, "%", "10", "4"], { encoding: "utf8" });
    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe("2");
  });

  test("supports power from CLI", () => {
    const result = spawnSync("node", [scriptPath, "power", "2", "5"], { encoding: "utf8" });
    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe("32");
  });

  test("supports square root from CLI", () => {
    const result = spawnSync("node", [scriptPath, "sqrt", "81"], { encoding: "utf8" });
    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe("9");
  });

  test("returns error for negative square root input", () => {
    const result = spawnSync("node", [scriptPath, "sqrt", "-9"], { encoding: "utf8" });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Square root of a negative number is not allowed.");
  });

  test("runs extended example operations from image via CLI", () => {
    const moduloResult = spawnSync("node", [scriptPath, "%", "5", "2"], { encoding: "utf8" });
    const powerResult = spawnSync("node", [scriptPath, "^", "2", "3"], { encoding: "utf8" });
    const squareRootResult = spawnSync("node", [scriptPath, "sqrt", "16"], { encoding: "utf8" });

    expect(moduloResult.status).toBe(0);
    expect(moduloResult.stdout.trim()).toBe("1");
    expect(powerResult.status).toBe(0);
    expect(powerResult.stdout.trim()).toBe("8");
    expect(squareRootResult.status).toBe(0);
    expect(squareRootResult.stdout.trim()).toBe("4");
  });
});
