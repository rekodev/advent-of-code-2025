import { formatInput, readInput } from "../utils.js";

/* --------------------------
   Main Functions
--------------------------- */

function processCalculations(input: Array<string>) {
  const equationMatrix: Array<Array<string>> = [];
  let sum = 0;

  for (let i = 0; i < input.length; i++) {
    const row = input[i];
    const splitRow = row?.split(" ").filter((val) => val !== "");

    equationMatrix.push(splitRow || []);
  }

  for (let i = 0; i < (equationMatrix[0] || []).length; i++) {
    let result = 0;

    for (let j = 0; j < equationMatrix.length - 1; j++) {
      const number = equationMatrix?.[j]?.[i];
      const operator = equationMatrix?.[equationMatrix.length - 1]?.[i];

      if (!result) {
        result = Number(number);
        continue;
      }
      if (operator === "*") result = result * Number(number);
      if (operator === "+") result = result + Number(number);
    }

    sum += result;
  }

  return sum;
}

function processCalculationsPart2(input: Array<string>) {
  const columnSeparatorIndicesAndOperators: Record<
    number,
    { separatorIndex: number; operator: string }
  > = {};
  let startingColumnIndex = 0;
  let currentOperator = input[input.length - 1]?.[0] || "";

  const maxRowLength = Math.max(...input.slice(0, -1).map((row) => row.length));

  for (let i = 1; i <= maxRowLength; i++) {
    if (
      input[input.length - 1]?.[i] === "*" ||
      input[input.length - 1]?.[i] === "+" ||
      i === maxRowLength
    ) {
      columnSeparatorIndicesAndOperators[startingColumnIndex] = {
        separatorIndex: i === maxRowLength ? i : i - 1,
        operator: currentOperator,
      };

      currentOperator = input[input.length - 1]?.[i] || "";
      startingColumnIndex++;
    }
  }

  const columnMap: Record<number, { rows: Array<string>; operator: string }> =
    {};

  for (let i = 0; i < input.length - 1; i++) {
    const row = input[i];

    let currentColumn = 0;
    let currentNumber = "";

    for (let j = 0; j <= (row || "").length; j++) {
      if (
        columnSeparatorIndicesAndOperators[currentColumn]?.separatorIndex === j
      ) {
        if (!columnMap[currentColumn]) {
          columnMap[currentColumn] = {
            rows: [currentNumber],
            operator:
              columnSeparatorIndicesAndOperators[currentColumn]?.operator || "",
          };
        } else {
          columnMap[currentColumn]?.rows.push(currentNumber);
        }

        currentNumber = "";
        currentColumn++;
        continue;
      }

      currentNumber = currentNumber.concat(row?.[j] || "");
    }
  }
  console.log({ columnSeparatorIndicesAndOperators });

  let finalResult = 0;

  Object.values(columnMap).forEach((value) => {
    const { rows, operator } = value;

    const stringifiedFinalNumbers = [];
    let currentIdx = 0;

    while (true) {
      if (currentIdx === rows[0]?.length) break;

      let finalNumber = "";

      for (const row of rows) {
        if (row[currentIdx] !== " ") {
          finalNumber = finalNumber.concat(row[currentIdx] || "");
        }
      }

      stringifiedFinalNumbers.push(finalNumber);
      finalNumber = "";
      currentIdx++;
    }

    let localResult = 0;

    for (let i = 0; i < stringifiedFinalNumbers.length; i++) {
      const strFinNum = stringifiedFinalNumbers[i];

      if (operator === "*") {
        if (!localResult) localResult = Number(strFinNum);
        else localResult *= Number(strFinNum);
      } else if (operator === "+") {
        localResult += Number(strFinNum);
      }
    }

    finalResult += localResult;
  });

  return finalResult;
}

/* --------------------------
   Run Solutions
--------------------------- */

// Example input
const exampleInput = `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  `;

// Part 1 (Example)
console.log(processCalculations(formatInput(exampleInput)));

// Part 1 (Example)
console.log(processCalculationsPart2(formatInput(exampleInput)));

// Actual input
const input = readInput("/day6/input.txt");

// Part 1 (Actual)
console.log(processCalculations(formatInput(input)));

// Part 2 (Actual)
console.log(processCalculationsPart2(formatInput(input)));
