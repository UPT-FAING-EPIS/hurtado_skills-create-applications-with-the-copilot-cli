#!/usr/bin/env node

/**
 * Simple Node.js CLI calculator.
 * Supported operations:
 * - addition (+)
 * - subtraction (-)
 * - multiplication (*)
 * - division (/)
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

function calculate(operationInput, left, right) {
  const operation = operationAliases[operationInput];

  if (!operation) {
    throw new Error(
      `Invalid operation: "${operationInput}". Use addition, subtraction, multiplication, division, or +, -, *, /.`
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
    default:
      throw new Error("Unexpected operation.");
  }
}

function runCli(argv) {
  const [, , operationInput, leftInput, rightInput] = argv;
  const operation = operationAliases[operationInput];

  if (!operationInput || leftInput === undefined || rightInput === undefined) {
    console.error("Usage: node src/calculator.js <operation> <number1> <number2>");
    console.error("Operations: addition|subtraction|multiplication|division or +|-|*|/");
    return 1;
  }

  const left = Number(leftInput);
  const right = Number(rightInput);

  if (Number.isNaN(left) || Number.isNaN(right)) {
    console.error("Invalid input: operands must be valid numbers.");
    return 1;
  }

  if (!operation) {
    console.error(
      `Invalid operation: "${operationInput}". Use addition, subtraction, multiplication, division, or +, -, *, /.`
    );
    return 1;
  }

  if (operation === "/" && right === 0) {
    console.error("Division by zero is not allowed.");
    return 1;
  }

  const result = calculate(operationInput, left, right);
  console.log(result);
  return 0;
}

module.exports = {
  addition,
  subtraction,
  multiplication,
  division,
  calculate,
  runCli,
};

if (require.main === module) {
  process.exit(runCli(process.argv));
}
