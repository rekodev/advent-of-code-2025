import { readInput, formatInput } from "../utils.js";

// Whether to enable Part 2 logic
const WITH_PASSWORD_METHOD = true;

/* --------------------------
   Main Function
--------------------------- */

/**
 * Processes a sequence of dial instructions and counts how many times
 * the dial points at zero.
 *
 * @param instructions - Array of instructions like "L68" or "R30"
 * @param withPasswordMethod - Whether to apply Part 2 counting logic
 * @returns Number of times the dial points at zero
 */
function processInstructions(
  instructions: Array<string>,
  withPasswordMethod?: boolean,
) {
  let currentDialPointingAt = 50;
  let dialPointingAtZeroTimes = 0;

  for (const instruction of instructions) {
    const direction = instruction.substring(0, 1) as "L" | "R";
    const distance = Number(instruction.substring(1));

    let result = 0;
    // Excess hundreds don't matter since the dial wraps every 100 increments
    const excessHundreds = Math.floor(distance / 100);

    if (withPasswordMethod) dialPointingAtZeroTimes += excessHundreds;

    if (direction === "L") {
      result = currentDialPointingAt - (distance - excessHundreds * 100);
    } else {
      result = currentDialPointingAt + (distance - excessHundreds * 100);
    }

    if (result >= 100) {
      result -= 100;

      if (withPasswordMethod && currentDialPointingAt !== 0 && result !== 0)
        dialPointingAtZeroTimes++;
    } else if (result < 0) {
      result += 100;

      if (withPasswordMethod && currentDialPointingAt !== 0 && result !== 0)
        dialPointingAtZeroTimes++;
    }

    if (result === 0) dialPointingAtZeroTimes++;
    currentDialPointingAt = result;
  }

  return dialPointingAtZeroTimes;
}

/* --------------------------
   Run Solutions
--------------------------- */

// Example input
const exampleInput = `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`;

// Part 1 (Example)
console.log(processInstructions(formatInput(exampleInput))); // 3
// Part 2 (Example)
console.log(
  processInstructions(formatInput(exampleInput), WITH_PASSWORD_METHOD),
); // 6

// Actual input
const input = readInput("/day1/input.txt");

// Part 1 (Actual)
console.log(processInstructions(formatInput(input))); // 969
// Part 2 (Actual)
console.log(processInstructions(formatInput(input), WITH_PASSWORD_METHOD)); // 5887
