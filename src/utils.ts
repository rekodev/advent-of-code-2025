import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function readInput(file = "input.txt") {
  return readFileSync(path.join(__dirname, file), "utf8").trim();
}

export function formatInput(input: string) {
  return input.split("\n");
}
