import { formatInput, readInput } from "../utils.js";

type Box = [a: string, b: string, c: string];

const IS_PART_TWO = true;

/* --------------------------
   Helper Functions
--------------------------- */

/**
 * Calculates the Euclidean distance between two junction boxes in 3D space.
 *
 * @param pos1 - First box coordinates [x, y, z]
 * @param pos2 - Second box coordinates [x, y, z]
 * @returns Euclidean distance between the two boxes
 */
function findEuclidianDistance(pos1: Box, pos2: Box) {
  return Math.sqrt(
    Math.pow(Number(pos1[0]) - Number(pos2[0]), 2) +
      Math.pow(Number(pos1[1]) - Number(pos2[1]), 2) +
      Math.pow(Number(pos1[2]) - Number(pos2[2]), 2),
  );
}

/**
 * Finds the index of the circuit that contains the given box.
 *
 * @param box - The box to search for
 * @param circuits - Array of circuits (each circuit is an array of boxes)
 * @returns Index of the circuit containing the box, or -1 if not found
 */
function findIndexOfBoxBelongingToCircuit(
  box: Box,
  circuits: Array<Array<Box>>,
) {
  return circuits.findIndex((circuit) =>
    circuit.find(
      (circuitBox) =>
        circuitBox?.[0] === box?.[0] &&
        circuitBox?.[1] === box?.[1] &&
        circuitBox?.[2] === box?.[2],
    ),
  );
}

/**
 * Creates a unique key for a pair of boxes (edge) using their indices.
 * Ensures the key is the same regardless of order (i,j) or (j,i).
 *
 * @param i - Index of first box
 * @param j - Index of second box
 * @returns Unique key string for the pair
 */
function edgeKey(i: number, j: number) {
  const a = Math.min(i, j);
  const b = Math.max(i, j);
  return `${a}|${b}`;
}

/**
 * Creates a unique key for a box based on its coordinates.
 *
 * @param box - Box coordinates [x, y, z]
 * @returns Unique key string for the box
 */
function boxKey(box: Box) {
  return `${box[0]},${box[1]},${box[2]}`;
}

/* --------------------------
   Main Function
--------------------------- */

/**
 * Connects junction boxes by repeatedly finding and connecting the closest pair of boxes.
 * Part 1: Makes a fixed number of connections and returns the product of the 3 largest circuits.
 * Part 2: Continues until all boxes are in a single circuit and returns the product of the
 * x-coordinates of the last two connected boxes.
 *
 * @param input - Array of strings, each representing box coordinates "x,y,z"
 * @param connections - Number of connections to make (only used in Part 1)
 * @param isPart2 - If true, runs Part 2 logic; otherwise runs Part 1 logic
 * @returns For Part 1: product of sizes of 3 largest circuits; For Part 2: product of x-coordinates
 */
function connectJunctionBoxes(
  input: Array<string>,
  connections = 10,
  isPart2 = false,
) {
  // Parse input into array of Box tuples
  const formattedBoxes = input.map((entry) => entry.split(","));
  const circuits: Array<Array<Box>> = [];
  const connectedPairs = new Set<string>();

  let counter = connections;
  let lastBox1: Box;
  let lastBox2: Box;

  // Part 1: Continue for 'connections' iterations
  // Part 2: Continue until all boxes are in a single circuit
  while (
    isPart2
      ? !(
          circuits.length === 1 &&
          new Set((circuits.at(0) || []).map(boxKey)).size ===
            formattedBoxes.length
        )
      : counter > 0
  ) {
    if (!isPart2) counter--;

    // Find the pair of boxes with the shortest distance that haven't been connected yet
    let shortestDistance = Infinity;
    let circuitWithShortestDistanceIdx1 = -1;
    let circuitWithShortestDistanceIdx2 = -1;

    for (let i = 0; i < formattedBoxes.length; i++) {
      for (let j = 0; j < formattedBoxes.length; j++) {
        if (i === j) continue;

        const key = edgeKey(i, j);
        if (connectedPairs.has(key)) continue;

        const box1 = formattedBoxes[i] as Box;
        const box2 = formattedBoxes[j] as Box;

        if (!box1 || !box2) return;

        const distance = findEuclidianDistance(box1, box2);

        if (distance < shortestDistance) {
          shortestDistance = distance;

          circuitWithShortestDistanceIdx1 = i;
          circuitWithShortestDistanceIdx2 = j;
        }
      }
    }

    // Mark this pair as connected
    const key = edgeKey(
      circuitWithShortestDistanceIdx1,
      circuitWithShortestDistanceIdx2,
    );
    connectedPairs.add(key);

    const box1 = formattedBoxes[circuitWithShortestDistanceIdx1] as Box;
    const box2 = formattedBoxes[circuitWithShortestDistanceIdx2] as Box;

    // Check if either box already belongs to an existing circuit
    const existingBox1CircuitIndex = findIndexOfBoxBelongingToCircuit(
      box1,
      circuits,
    );
    const existingBox2CircuitIndex = findIndexOfBoxBelongingToCircuit(
      box2,
      circuits,
    );

    if (
      existingBox1CircuitIndex === existingBox2CircuitIndex &&
      existingBox1CircuitIndex !== -1
    ) {
      // Both boxes are already in the same circuit: no action needed
      // (still counts as a connection attempt for Part 1)
      if (isPart2) {
        // For Part 2, don't update lastBox1/lastBox2 since no merge occurred
      }
      continue;
    } else if (
      existingBox1CircuitIndex !== -1 &&
      existingBox2CircuitIndex !== -1
    ) {
      // Both boxes are in different circuits: MERGE the circuits
      if (isPart2) {
        lastBox1 = box1;
        lastBox2 = box2;
      }

      for (const element of circuits[existingBox2CircuitIndex] || []) {
        circuits[existingBox1CircuitIndex]?.push(element);
      }

      circuits.splice(existingBox2CircuitIndex, 1);
    } else if (
      existingBox1CircuitIndex !== -1 &&
      existingBox2CircuitIndex === -1
    ) {
      // Box1 is in a circuit, Box2 is not: ATTACH Box2 to Box1's circuit
      if (isPart2) {
        lastBox1 = box1;
        lastBox2 = box2;
      }

      circuits[existingBox1CircuitIndex]?.push(box2);
    } else if (
      existingBox1CircuitIndex === -1 &&
      existingBox2CircuitIndex !== -1
    ) {
      // Box2 is in a circuit, Box1 is not: ATTACH Box1 to Box2's circuit
      if (isPart2) {
        lastBox1 = box1;
        lastBox2 = box2;
      }

      circuits[existingBox2CircuitIndex]?.push(box1);
    } else {
      // Neither box is in a circuit: CREATE a new circuit with both boxes
      if (isPart2) {
        lastBox1 = box1;
        lastBox2 = box2;
      }

      circuits.push([box1, box2]);
    }
  }

  // Part 2: Return product of x-coordinates of the last two connected boxes
  if (isPart2) {
    return Number(lastBox1![0]) * Number(lastBox2![0]);
  }

  // Part 1: Return product of the sizes of the 3 largest circuits
  const sortedCircuits = circuits.sort((a, b) => b.length - a.length);
  const result =
    Number(sortedCircuits[0]?.length) *
    Number(sortedCircuits[1]?.length) *
    Number(sortedCircuits[2]?.length);

  return result;
}

/* --------------------------
   Run Solutions
--------------------------- */

// Example input
const exampleInput = `162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689`;

// Part 1 (Example)
console.log(connectJunctionBoxes(formatInput(exampleInput))); // 40

// Part 2 (Example)
console.log(connectJunctionBoxes(formatInput(exampleInput), 10, IS_PART_TWO)); // 25272

// Actual input
const input = readInput("/day8/input.txt");

// Part 1 (Actual)
console.log(connectJunctionBoxes(formatInput(input), 1000)); // 131150

// Part 2 (Actual)
console.log(connectJunctionBoxes(formatInput(input), 10, IS_PART_TWO)); // 2497445
