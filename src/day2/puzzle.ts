import { readInput } from "../utils.js";

// Whether to enable Part 2 logic
const WITH_MULTIPLE_REPETITIONS = true;

// Helper function to transform input into an array of ranges
function transformInputToRanges(input: string) {
  const ranges = input.split(",").map((range) => {
    const splitRange = range.split("-");

    return [splitRange[0], splitRange[1]];
  });

  return ranges;
}

/* --------------------------
   Main Function
--------------------------- */

/**
 * Processes a sequence of ranges of numbers like 11-22 or 95-115
 * And counts sum of invalid numbers within the ranges
 *
 * @param input - string input that is later transformed into an array of ranges
 * @param withMultipleRepetitions - Whether to apply Part 2 repetition finding logic
 * @returns Sum of invalid numbers found within ranges
 */
function detectInvalidIdsInRanges(
  input: string,
  withMultipleRepetitions?: boolean,
) {
  const ranges = transformInputToRanges(input);

  let sum = 0;

  for (const range of ranges) {
    const startingNumber = Number(range[0]);
    const endingNumber = Number(range[1]);

    for (let i = startingNumber; i <= endingNumber; i++) {
      const stringifiedNumber = i.toString();
      if (stringifiedNumber.startsWith("0")) continue;

      if (!withMultipleRepetitions) {
        // Part 1 Logic
        if (i.toString().length % 2 !== 0) continue;

        const halfwayPoint = stringifiedNumber.length / 2;
        const leftSide = stringifiedNumber.substring(0, halfwayPoint);
        const rightSide = stringifiedNumber.substring(halfwayPoint);

        if (leftSide === rightSide) sum += i;
      } else {
        // Part 2 Logic
        let repeatedString = "";

        for (let j = 0; j < stringifiedNumber.length; j++) {
          repeatedString = repeatedString.concat(stringifiedNumber[j] || "");

          const repeatAmount = Math.floor(
            stringifiedNumber.length / repeatedString.length,
          );

          if (
            repeatAmount >= 2 &&
            repeatedString.repeat(repeatAmount) === stringifiedNumber
          ) {
            sum += i;
            break;
          }
        }
      }
    }
  }

  return sum;
}

/* --------------------------
   Run Solutions
--------------------------- */

// Example input
const exampleInput = `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124`;

// Part 1 (Example)
console.log(detectInvalidIdsInRanges(exampleInput)); // 1227775554
// Part 2 (Example)
console.log(detectInvalidIdsInRanges(exampleInput, WITH_MULTIPLE_REPETITIONS)); // 4174379265

// Actual input
const input = readInput("/day2/input.txt");

// Part 1 (Actual)
console.log(detectInvalidIdsInRanges(input)); // 41294979841
// Part 2 (Actual)
console.log(detectInvalidIdsInRanges(input, WITH_MULTIPLE_REPETITIONS)); // 66500947346
