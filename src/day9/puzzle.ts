import { formatInput, readInput } from "../utils.js";

// Whether to enable Part 2 logic
const USING_ONLY_RED_AND_GREEN_TILES = true;

/* --------------------------
   Main Functions
--------------------------- */

/**
 * Splits a coordinate string by comma and converts to numbers.
 *
 * @param str - Coordinate string like "7,1"
 * @returns Array of numbers [7, 1]
 */
function splitAndConvertToNumber(str: string) {
  return str.split(",").map(Number);
}

/**
 * Converts array of coordinate strings to 2D array of numbers.
 *
 * @param input - Array of coordinate strings
 * @returns 2D array of coordinate pairs
 */
function coordinatesToPolygon(input: Array<string>) {
  const polygon: Array<Array<number>> = [];

  for (let i = 0; i < input.length; i++) {
    polygon.push(splitAndConvertToNumber(input?.[i] || ""));
  }

  return polygon;
}

/**
 * Checks if a point lies on a line segment.
 *
 * @param px - Point x coordinate
 * @param py - Point y coordinate
 * @param x1 - Segment start x
 * @param y1 - Segment start y
 * @param x2 - Segment end x
 * @param y2 - Segment end y
 * @returns True if point is on the segment
 */
function pointOnSegment(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) {
  const cross = (px - x1) * (y2 - y1) - (py - y1) * (x2 - x1);

  if (cross !== 0) return false;

  const within =
    px >= Math.min(x1, x2) &&
    px <= Math.max(x1, x2) &&
    py >= Math.min(y1, y2) &&
    py <= Math.max(y1, y2);

  return within;
}

/**
 * Checks if a point is inside or on the boundary of a polygon using ray casting.
 *
 * @param point - Point coordinates [x, y]
 * @param polygon - Array of polygon vertices
 * @returns True if point is inside or on polygon boundary
 */
function pointInPolygon(
  point: [number, number],
  polygon: Array<Array<number>>,
) {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = Number(polygon[i]?.[0]);
    const yi = Number(polygon[i]?.[1]);

    const xj = Number(polygon[j]?.[0]);
    const yj = Number(polygon[j]?.[1]);

    if (pointOnSegment(x, y, xi, yi, xj, yj)) return true;

    const intersects =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersects) inside = !inside;
  }

  return inside;
}

/**
 * Checks if a polygon edge intersects the interior of a rectangle.
 *
 * @param minY - Rectangle minimum y
 * @param minX - Rectangle minimum x
 * @param maxY - Rectangle maximum y
 * @param maxX - Rectangle maximum x
 * @param y1 - Edge start y
 * @param x1 - Edge start x
 * @param y2 - Edge end y
 * @param x2 - Edge end x
 * @returns True if edge cuts through rectangle interior
 */
function rectangleIntersectsEdge(
  minY: number,
  minX: number,
  maxY: number,
  maxX: number,
  y1: number,
  x1: number,
  y2: number,
  x2: number,
): boolean {
  // Check if edge crosses through rectangle interior (not just touching corners)
  // Horizontal edge
  if (y1 === y2) {
    const edgeY = y1;
    const edgeMinX = Math.min(x1, x2);
    const edgeMaxX = Math.max(x1, x2);

    if (edgeY > minY && edgeY < maxY) {
      if (edgeMaxX > minX && edgeMinX < maxX) {
        return true;
      }
    }
  }
  // Vertical edge
  if (x1 === x2) {
    const edgeX = x1;
    const edgeMinY = Math.min(y1, y2);
    const edgeMaxY = Math.max(y1, y2);

    if (edgeX > minX && edgeX < maxX) {
      if (edgeMaxY > minY && edgeMinY < maxY) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Finds the largest rectangle area using two red tiles as opposite corners.
 * For Part 2, only includes rectangles within the polygon of red/green tiles.
 *
 * @param input - Array of red tile coordinate strings
 * @param usingOnlyRedAndGreenTiles - If true, applies Part 2 polygon constraint
 * @returns Largest rectangle area found
 */
function findLargestRectangleArea(
  input: Array<string>,
  usingOnlyRedAndGreenTiles?: boolean,
) {
  let largestArea = 0;
  const polygon = coordinatesToPolygon(input);

  for (const coordinates of input) {
    const splitCoordinates = splitAndConvertToNumber(coordinates);

    for (let i = 0; i < input.length; i++) {
      const splitCoordinatesInner = splitAndConvertToNumber(input[i] || "");

      if (
        splitCoordinatesInner[0] === splitCoordinates[0] &&
        splitCoordinatesInner[1] === splitCoordinates[1]
      )
        continue;

      const a = splitCoordinates;
      const b = splitCoordinatesInner;

      const minX = Math.min(Number(a[1]), Number(b[1]));
      const maxX = Math.max(Number(a[1]), Number(b[1]));
      const minY = Math.min(Number(a[0]), Number(b[0]));
      const maxY = Math.max(Number(a[0]), Number(b[0]));

      if (usingOnlyRedAndGreenTiles) {
        const cornerOne: [number, number] = [minY, minX];
        const cornerTwo: [number, number] = [minY, maxX];
        const cornerThree: [number, number] = [maxY, minX];
        const cornerFour: [number, number] = [maxY, maxX];

        const isEveryCornerInPolygon = [
          cornerOne,
          cornerTwo,
          cornerThree,
          cornerFour,
        ].every((val) => pointInPolygon(val, polygon));

        if (!isEveryCornerInPolygon) continue;

        let edgeIntersects = false;

        for (let j = 0; j < polygon.length; j++) {
          const k = (j + 1) % polygon.length;
          const y1 = polygon[j]?.[0] ?? 0;
          const x1 = polygon[j]?.[1] ?? 0;
          const y2 = polygon[k]?.[0] ?? 0;
          const x2 = polygon[k]?.[1] ?? 0;

          if (rectangleIntersectsEdge(minY, minX, maxY, maxX, y1, x1, y2, x2)) {
            edgeIntersects = true;
            break;
          }
        }

        if (edgeIntersects) continue;
      }

      const width = maxX - minX + 1;
      const height = maxY - minY + 1;
      const area = width * height;

      if (area > largestArea) largestArea = area;
    }
  }

  return largestArea;
}

/* --------------------------
   Run Solutions
--------------------------- */

// Example input
const exampleInput = `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`;

// Part 1 (Example)
console.log(findLargestRectangleArea(formatInput(exampleInput))); // 50

// Part 2 (Example)
console.log(
  findLargestRectangleArea(
    formatInput(exampleInput),
    USING_ONLY_RED_AND_GREEN_TILES,
  ),
); // 24

// Actual input
const input = readInput("/day9/input.txt");

// Part 1 (Actual)
console.log(findLargestRectangleArea(formatInput(input))); // 4758121828

// Part 2 (Actual)
console.log(
  findLargestRectangleArea(formatInput(input), USING_ONLY_RED_AND_GREEN_TILES),
); // 1577956170
