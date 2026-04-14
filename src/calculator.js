#!/usr/bin/env node

/**
 * Simple Node.js CLI calculator.
 * Supported operations:
 * - addition (+)
 * - subtraction (-)
 * - multiplication (*)
 * - division (/)
 * - modulo (%)
 * - exponentiation/power (^)
 * - square root (sqrt)
 */

const operationAliases = {
  addition: "+",
  add: "+",
  "+": "+",
  subtraction: "-",
  subtract: "-",
  "-": "-",
  multiplication: "*",
  multiply: "*",
  "*": "*",
  division: "/",
  divide: "/",
  "/": "/",
  modulo: "%",
  mod: "%",
  "%": "%",
  power: "^",
  exponentiation: "^",
  pow: "^",
  "^": "^",
  squareroot: "sqrt",
  squareRoot: "sqrt",
  sqrt: "sqrt",
};

function addition(left, right) {
  return left + right;
}

function subtraction(left, right) {
  return left - right;
}

function multiplication(left, right) {
  return left * right;
}

function division(left, right) {
  if (right === 0) {
    throw new Error("Division by zero is not allowed.");
  }

  return left / right;
}

function modulo(left, right) {
  if (right === 0) {
    throw new Error("Modulo by zero is not allowed.");
  }

  return left % right;
}

function power(base, exponent) {
  return base ** exponent;
}

function squareRoot(value) {
  if (value < 0) {
    throw new Error("Square root of a negative number is not allowed.");
  }

  return Math.sqrt(value);
}

function calculate(operationInput, left, right) {
  const operation = operationAliases[operationInput];

  if (!operation) {
    throw new Error(
      `Invalid operation: "${operationInput}". Use addition, subtraction, multiplication, division, modulo, power, squareRoot, or +, -, *, /, %, ^, sqrt.`
    );
  }

  switch (operation) {
    case "+":
      return addition(left, right);
    case "-":
      return subtraction(left, right);
    case "*":
      return multiplication(left, right);
    case "/":
      return division(left, right);
    case "%":
      return modulo(left, right);
    case "^":
      return power(left, right);
    case "sqrt":
      return squareRoot(left);
    default:
      throw new Error("Unexpected operation.");
  }
}

function runCli(argv) {
  const [, , operationInput, firstOperandInput, secondOperandInput] = argv;
  const operation = operationAliases[operationInput];
  const isUnaryOperation = operation === "sqrt";

  if (!operationInput || firstOperandInput === undefined) {
    console.error("Usage: node src/calculator.js <operation> <number1> [number2]");
    console.error(
      "Operations: addition|subtraction|multiplication|division|modulo|power|squareRoot or +|-|*|/|%|^|sqrt"
    );
    return 1;
  }

  if (!operation) {
    console.error(
      `Invalid operation: "${operationInput}". Use addition, subtraction, multiplication, division, modulo, power, squareRoot, or +, -, *, /, %, ^, sqrt.`
    );
    return 1;
  }

  if (!isUnaryOperation && secondOperandInput === undefined) {
    console.error(`Operation "${operationInput}" requires two numeric operands.`);
    return 1;
  }

  const left = Number(firstOperandInput);
  const right = secondOperandInput === undefined ? undefined : Number(secondOperandInput);

  if (Number.isNaN(left) || (!isUnaryOperation && Number.isNaN(right))) {
    console.error("Invalid input: operands must be valid numbers.");
    return 1;
  }

  try {
    const result = calculate(operationInput, left, right);
    console.log(result);
    return 0;
  } catch (error) {
    console.error(error.message);
    return 1;
  }
}

module.exports = {
  addition,
  subtraction,
  multiplication,
  division,
  modulo,
  power,
  squareRoot,
  calculate,
  runCli,
};

if (require.main === module) {
  process.exit(runCli(process.argv));
}
