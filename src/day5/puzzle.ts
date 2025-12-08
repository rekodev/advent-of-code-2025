import { readInput } from "../utils.js";

/* --------------------------
   Main Functions
--------------------------- */

/**
 * Main function for Part 1. Counts how many ingredient IDs from the list
 * fall within at least one fresh ingredient range.
 *
 * @param input - Raw input string containing ranges and IDs separated by blank line
 * @returns Number of IDs that fall within the fresh ingredient ranges
 */
function getListOfFreshIngredients(input: string) {
  const splitInput = input.split("\n");
  const separatorIndex = splitInput.findIndex((value) => value === "");
  const ids = splitInput.splice(separatorIndex);
  ids.shift();
  const ranges = splitInput;

  let amountOfFreshIds = 0;

  for (const id of ids) {
    for (const range of ranges) {
      const formattedRange = range.split("-");

      if (formattedRange[0] !== undefined && formattedRange[1] !== undefined) {
        if (
          Number(id) >= Number(formattedRange[0]) &&
          Number(id) <= Number(formattedRange[1])
        ) {
          amountOfFreshIds++;
          break;
        }
      }
    }
  }

  return amountOfFreshIds;
}

/**
 * Main function for Part 2. Counts the total number of unique ingredient IDs
 * that are considered fresh across all ranges by merging overlapping and
 * adjacent ranges.
 *
 * @param input - Raw input string containing fresh ingredient ranges
 * @returns Total count of unique ingredient IDs considered fresh
 */
function getListOfFreshIngredientsPart2(input: string) {
  const splitInput = input.split("\n");
  const separatorIndex = splitInput.findIndex((value) => value === "");
  splitInput.splice(separatorIndex);

  const existingRanges = splitInput.map((range) =>
    range.split("-").map(Number),
  );

  let currentRangeIndex = 0;
  let overlappingIndex = -1;

  // Merge overlapping and adjacent ranges
  while (true) {
    const currentRange = existingRanges[currentRangeIndex];

    const foundOverlappingRange = existingRanges.find((r, index) => {
      // Check if ranges overlap or are adjacent (using +1 to treat adjacent as overlapping)
      const isOverlapping =
        Number(currentRange?.[0]) <= Number(r[1]) + 1 &&
        Number(r[0]) <= Number(currentRange?.[1]) + 1;

      // Skip comparing range with itself (same index)
      const isSameIndex = index === currentRangeIndex;

      if (isOverlapping && !isSameIndex) overlappingIndex = index;

      return isOverlapping && !isSameIndex;
    });

    if (!foundOverlappingRange) {
      currentRangeIndex++;
      if (currentRangeIndex === existingRanges.length) break;
    } else {
      const newRange = [
        Math.min(Number(currentRange?.[0]), Number(foundOverlappingRange?.[0])),
        Math.max(Number(currentRange?.[1]), Number(foundOverlappingRange?.[1])),
      ];

      const currentIndexInExistingRanges = existingRanges.findIndex(
        (el) => el[0] === currentRange?.[0] && el[1] === currentRange?.[1],
      );

      existingRanges.splice(overlappingIndex, 1, newRange);
      if (
        currentIndexInExistingRanges !== -1 &&
        currentIndexInExistingRanges !== overlappingIndex
      ) {
        const adjustedIndex =
          currentIndexInExistingRanges > overlappingIndex
            ? currentIndexInExistingRanges - 1
            : currentIndexInExistingRanges;
        existingRanges.splice(adjustedIndex, 1);
      }

      currentRangeIndex = 0;
    }
  }

  let grandTotal = 0;

  for (const range of existingRanges) {
    grandTotal += Number(range?.[1]) - Number(range?.[0]) + 1;
  }

  return grandTotal;
}

/* --------------------------
   Run Solutions
--------------------------- */

// Example input
const exampleInput = `3-5
10-14
16-20
12-18

1
5
8
11
17
32`;

// Part 1 (Example)
console.log(getListOfFreshIngredients(exampleInput)); // 3

// Part 2 (Example)
console.log(getListOfFreshIngredientsPart2(exampleInput)); // 14

// Actual input
const input = readInput("/day5/input.txt");

// Part 1 (Actual)
console.log(getListOfFreshIngredients(input)); // 848

// Part 2 (Actual)
console.log(getListOfFreshIngredientsPart2(input)); // 334714395325710
