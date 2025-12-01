import { readInput, formatInput } from "../utils.js";

function processInstructions(instructions: Array<string>) {
  // Starts at 50
  let currentDialPointingAt = 50;
  let dialPointingAtZeroTimes = 0;

  for (const instruction of instructions) {
    const direction = instruction.substring(0, 1) as "L" | "R";
    const distance = Number(instruction.substring(1));

    let result = 0;
    // Excess hundreds don't matter since the dial wraps every 100 increments
    const excessHundreds = Math.floor(distance / 100);

    if (direction === "L") {
      result = currentDialPointingAt - (distance - excessHundreds * 100);
    } else {
      result = currentDialPointingAt + (distance - excessHundreds * 100);
    }

    if (result >= 100) {
      result -= 100;
    } else if (result < 0) {
      result += 100;
    }

    if (result === 0) dialPointingAtZeroTimes++;
    currentDialPointingAt = result;
  }

  return dialPointingAtZeroTimes;
}

// Example input/output:
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
console.log(processInstructions(formatInput(exampleInput))); // Expected output: 3

// Actual input/output
const input = readInput("/day1/input1.txt");
console.log(processInstructions(formatInput(input))); // Expected output: 969
