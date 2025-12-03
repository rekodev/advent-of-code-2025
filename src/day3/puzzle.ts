import { formatInput, readInput } from "../utils.js";

const TWELVE_BATTERIES = true;

/* --------------------------
   Main Function
--------------------------- */

function findTotalJoltageOutput(
  input: Array<string>,
  twelveBatteries?: boolean,
) {
  let sum = 0;

  if (!twelveBatteries) {
    // Part 1 Logic
    for (const bank of input) {
      let firstLargest;
      let firstLargestIndex = -1;
      let secondLargest;

      for (let i = 0; i < bank.length; i++) {
        const numericChar = Number(bank[i]);

        if (
          !firstLargest ||
          (firstLargest < numericChar && i !== bank.length - 1)
        ) {
          firstLargest = numericChar;
          firstLargestIndex = i;
        }
      }

      for (let i = firstLargestIndex + 1; i < bank.length; i++) {
        const numericChar = Number(bank[i]);

        if (!secondLargest || secondLargest < numericChar) {
          secondLargest = numericChar;
        }
      }

      const largestPossible =
        (firstLargest || "").toString() + (secondLargest || "").toString();
      sum += Number(largestPossible);
    }
  } else {
    // Part 2 Logic

    for (const bank of input) {
      let windowSize = 12;
      let startingIndex = 0;
      let largestNumberInBank = "";

      while (windowSize > 0) {
        let largestIndex = startingIndex;
        let largestNext;

        for (let i = startingIndex; i <= bank.length - windowSize; i++) {
          const numericChar = Number(bank[i]);

          if (numericChar === largestNext) continue;
          if (!largestNext || numericChar > largestNext) {
            largestNext = numericChar;
            largestIndex = i;
          }
        }

        startingIndex = largestIndex + 1;
        largestNumberInBank = largestNumberInBank.concat(
          (largestNext || "").toString(),
        );
        windowSize--;
      }

      sum += Number(largestNumberInBank);
    }
  }

  return sum;
}

/* --------------------------
   Run Solutions
--------------------------- */

// Example input
const exampleInput = `987654321111111
811111111111119
234234234234278
818181911112111`;

// Part 1 (Example)
console.log(findTotalJoltageOutput(formatInput(exampleInput))); // 357
// Part 2 (Example)
console.log(
  findTotalJoltageOutput(formatInput(exampleInput), TWELVE_BATTERIES),
); // 17031

// Actual input
const input = readInput("/day3/input.txt");

// Part 1 (Example)
console.log(findTotalJoltageOutput(formatInput(input))); // 3121910778619
// Part 2 (Example)
console.log(findTotalJoltageOutput(formatInput(input), TWELVE_BATTERIES)); // 168575096286051
