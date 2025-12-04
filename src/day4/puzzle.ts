import { formatInput, readInput } from "../utils.js";

/**
 * Formats and splits the input string into a 2D array of characters.
 *
 * @param input - Raw input string
 * @returns 2D array where each element is a single character
 */
function formatAndSplitInput(input: string) {
  const formattedInput = formatInput(input);
  const splitInput = formattedInput.map((row) => row.split(""));

  return splitInput;
}

/* --------------------------
   Main Functions
--------------------------- */

/**
 * Main function for Part 1. Counts the number of accessible rolls of paper
 * (marked with "@") that have fewer than 4 adjacent rolls.
 *
 * @param input - 2D array representing the grid of rolls
 * @param withRemoval - If true, removes counted rolls from the grid (for Part 2)
 * @returns Number of accessible rolls with fewer than 4 adjacent rolls
 */
function countAmountOfAccessibleRollsOfPaper(
  input: Array<Array<string>>,
  withRemoval?: boolean,
) {
  let sum = 0;

  for (let i = 0; i < input.length; i++) {
    const row = input[i] as Array<string>;

    for (let j = 0; j < row.length; j++) {
      if (row[j] !== "@") continue;

      let amountOfAdjacentRolls = 0;

      if (row[j - 1] === "@") amountOfAdjacentRolls++;
      if (row[j + 1] === "@") amountOfAdjacentRolls++;
      if (input[i - 1]?.[j - 1] === "@") amountOfAdjacentRolls++;
      if (input[i - 1]?.[j] === "@") amountOfAdjacentRolls++;
      if (input[i - 1]?.[j + 1] === "@") amountOfAdjacentRolls++;
      if (input[i + 1]?.[j - 1] === "@") amountOfAdjacentRolls++;
      if (input[i + 1]?.[j] === "@") amountOfAdjacentRolls++;
      if (input[i + 1]?.[j + 1] === "@") amountOfAdjacentRolls++;

      if (amountOfAdjacentRolls < 4) {
        if (withRemoval) input[i]![j] = ".";
        sum++;
      }
    }
  }

  return sum;
}

/**
 * Wrapper function for Part 2. Repeatedly counts and removes accessible rolls
 * until no more accessible rolls remain.
 *
 * @param input - Raw input string
 * @returns Total count of all accessible rolls across all iterations
 */
function countTotalAmountOfAccessibleRollsOfPaperWithRemoval(input: string) {
  let totalSum = 0;

  const splitInput = formatAndSplitInput(input);

  while (true) {
    const currentSum = countAmountOfAccessibleRollsOfPaper(splitInput, true);

    totalSum += currentSum;
    if (currentSum === 0) break;
  }

  return totalSum;
}

/* --------------------------
   Run Solutions
--------------------------- */

// Example input
let exampleInput = `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`;

// Part 1 (Example)
console.log(
  countAmountOfAccessibleRollsOfPaper(formatAndSplitInput(exampleInput)),
); // 13

// Part 2 (Example)
console.log(countTotalAmountOfAccessibleRollsOfPaperWithRemoval(exampleInput)); // 43

// Actual input
const input = readInput("/day4/input.txt");

// Part 1 (Actual)
console.log(countAmountOfAccessibleRollsOfPaper(formatAndSplitInput(input))); // 1370

// Part 2 (Actual)
console.log(countTotalAmountOfAccessibleRollsOfPaperWithRemoval(input)); // 8437
