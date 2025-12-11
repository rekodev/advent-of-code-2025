import { formatInput, readInput } from "../utils.js";

/**
 * Parses input into a graph structure mapping keys to their connected nodes.
 *
 * @param input - Array of strings in format "key: node1 node2 node3"
 * @returns Record mapping each key to an array of connected node names
 */
function parseStructures(input: Array<string>): Record<string, Array<string>> {
  const structures: Record<string, Array<string>> = {};

  for (let i = 0; i < input.length; i++) {
    const splitRow = input[i]?.split(" ");
    const key = splitRow?.[0]?.slice(0, splitRow[0].length - 1);
    const value = splitRow?.slice(1);

    if (key && value) structures[key] = value;
  }

  return structures;
}

/* --------------------------
   Main Functions
--------------------------- */

/**
 * Finds the number of valid paths through a graph structure based on the puzzle part.
 *
 * @param input - Array of strings representing the graph structure
 * @param part - Which puzzle part to solve ("Part 1" or "Part 2")
 * @returns Number of valid paths found
 */
function findPaths(input: Array<string>, part: "Part 1" | "Part 2") {
  const structures = parseStructures(input);

  /**
   * Part 1: Recursively traverses the graph from a given node, counting all paths to "out".
   * Skips revisiting "you" to avoid infinite loops.
   *
   * @param structKey - Current node to traverse from
   * @returns Count of paths from this node to "out"
   */
  function traverseStructuresPart1(structKey: string): number {
    if (structures[structKey]?.includes("out")) return 1;
    let count = 0;

    for (let i = 0; i < (structures?.[structKey] || []).length; i++) {
      const nestedStructKey = structures[structKey]?.[i];

      if (nestedStructKey === "you") continue;
      if (nestedStructKey) count += traverseStructuresPart1(nestedStructKey);
    }

    return count;
  }

  /**
   * Part 2: Recursively traverses the graph, counting only paths to "out" that visit both "dac" AND "fft".
   * Uses memoization to cache results for (node, dacVisited, fftVisited) combinations,
   * preventing exponential time complexity from revisiting the same states.
   *
   * @param structKey - Current node to traverse from
   * @param dacVisited - Whether "dac" node has been visited in this path
   * @param fftVisited - Whether "fft" node has been visited in this path
   * @param memo - Cache mapping state keys to computed path counts
   * @returns Count of valid paths from this node that pass through both required nodes
   */
  function traverseStructuresPart2(
    structKey: string,
    dacVisited?: boolean,
    fftVisited?: boolean,
    memo: Map<string, number> = new Map(),
  ): number {
    const memoKey = `${structKey}-${dacVisited}-${fftVisited}`;
    if (memo.has(memoKey)) return memo.get(memoKey)!;

    if (structures[structKey]?.includes("out")) {
      if (dacVisited && fftVisited) {
        return 1;
      } else {
        return 0;
      }
    }

    let count = 0;

    for (let i = 0; i < (structures?.[structKey] || []).length; i++) {
      const nestedStructKey = structures[structKey]?.[i];

      const nextFftVisited = fftVisited || nestedStructKey === "fft";
      const nextDacVisited = dacVisited || nestedStructKey === "dac";

      if (nestedStructKey)
        count += traverseStructuresPart2(
          nestedStructKey,
          nextDacVisited,
          nextFftVisited,
          memo,
        );
    }

    memo.set(memoKey, count);
    return count;
  }

  if (part === "Part 1") {
    return traverseStructuresPart1("you");
  } else if (part === "Part 2") {
    return traverseStructuresPart2("svr");
  }
}

/* --------------------------
   Run Solutions
--------------------------- */

const input = readInput("/day11/input.txt");

// Part 1 - Example
const exampleInputPart1 = `aaa: you hhh
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
ddd: ggg
eee: out
fff: out
ggg: out
hhh: ccc fff iii
iii: out`;

console.log(findPaths(formatInput(exampleInputPart1), "Part 1")); // 5

// Part 1 - Actual
console.log(findPaths(formatInput(input), "Part 1")); // 708

// Part 2 - Example
const exampleInputPart2 = `svr: aaa bbb
aaa: fft
fft: ccc
bbb: tty
tty: ccc
ccc: ddd eee
ddd: hub
hub: fff
eee: dac
dac: fff
fff: ggg hhh
ggg: out
hhh: out`;

console.log(findPaths(formatInput(exampleInputPart2), "Part 2")); // 2

// Part 2 - Actual
console.log(findPaths(formatInput(input), "Part 2")); // 545394698933400
