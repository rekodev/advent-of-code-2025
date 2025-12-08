import { formatInput, readInput } from "../utils.js";

/* --------------------------
   Main Functions
--------------------------- */

/**
 * Main function for Part 1. Counts the number of times the beam splits
 * when encountering splitters (^) in the grid.
 *
 * @param input - Raw input string
 * @returns Number of times the beam splits
 */
function splitBeam(input: string) {
  const formattedInput = formatInput(input);

  let prevBeamIndices = [formattedInput[0]?.indexOf("S")];
  let splitCount = 0;

  for (let i = 1; i < formattedInput.length; i++) {
    const row = formattedInput[i];

    const newBeamIndices: Array<number> = [];
    const carryoverFromPrevIndices: Array<number> = [];

    for (let j = 0; j < (row || "").length; j++) {
      const char = formattedInput[i]?.[j];

      if (char !== "^") {
        if (prevBeamIndices.includes(j)) carryoverFromPrevIndices.push(j);
        continue;
      }

      const isBeamPresentAboveSplitter = prevBeamIndices.includes(j);
      if (isBeamPresentAboveSplitter) {
        splitCount++;

        const newIndexOne = j === 0 || j === (row || "").length - 1 ? j : j - 1;
        const newIndexTwo = j === 0 || j === (row || "").length - 1 ? j : j + 1;

        if (
          !newBeamIndices.includes(newIndexOne) &&
          newIndexOne >= 0 &&
          newIndexOne < (row || "").length
        ) {
          newBeamIndices.push(newIndexOne);
        }
        if (
          !newBeamIndices.includes(newIndexTwo) &&
          newIndexTwo >= 0 &&
          newIndexTwo < (row || "").length
        ) {
          newBeamIndices.push(newIndexTwo);
        }
      }
    }

    prevBeamIndices = newBeamIndices.concat(carryoverFromPrevIndices);
  }

  return splitCount;
}

/**
 * Main function for Part 2. Counts the number of possible solutions
 * where at each splitter, the beam can only go in one direction (left or right).
 * Uses memoization to optimize repeated state calculations.
 *
 * @param input - Formatted input array of strings
 * @param startRowIndex - Row index to start searching from
 * @param prevBeamIndex - Column index where the beam is currently located
 * @param memo - Memoization map to cache results
 * @returns Number of possible valid paths through the grid
 */
function countSolutions(
  input: Array<string>,
  startRowIndex: number,
  prevBeamIndex: number,
  memo: Map<string, number> = new Map(),
): number {
  const key = `${startRowIndex},${prevBeamIndex}`;
  if (memo.has(key)) return memo.get(key)!;

  if (prevBeamIndex < 0 || prevBeamIndex >= (input[0]?.length ?? 0)) {
    return 0;
  }

  for (let i = startRowIndex; i < input.length; i++) {
    const char = input[i]?.[prevBeamIndex];

    if (char !== "^") continue;

    let sum = 0;

    if (prevBeamIndex - 1 >= 0) {
      sum += countSolutions(input, i + 1, prevBeamIndex - 1, memo);
    }
    if (prevBeamIndex + 1 < (input?.[i]?.length ?? 0)) {
      sum += countSolutions(input, i + 1, prevBeamIndex + 1, memo);
    }

    memo.set(key, sum);
    return sum;
  }

  memo.set(key, 1);
  return 1;
}

/* --------------------------
   Run Solutions
--------------------------- */

// Example input
const exampleInput = `.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`;

const formattedExampleInput = formatInput(exampleInput);

// Part 1 (Example)
console.log(splitBeam(exampleInput)); // 21

// Part 2 (Example)
console.log(
  countSolutions(
    formattedExampleInput,
    1,
    formattedExampleInput[0]?.indexOf("S") || 0,
  ),
); // 40

// Actual input
const input = readInput("/day7/input.txt");
const formattedInput = formatInput(input);

// Part 1 (Actual)
console.log(splitBeam(input)); // 1585

// Part 2 (Actual)
console.log(
  countSolutions(formattedInput, 1, formattedInput[0]?.indexOf("S") || 0),
); // 16716444407407
