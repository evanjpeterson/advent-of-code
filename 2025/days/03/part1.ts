import { debug, getInput, log, parseNumber } from "@/common"

/**
 * Advent of Code 2025 Day 3 Part 1
 * https://adventofcode.com/2025/day/3
 */

// Low: 16757
// Goldy:
// High: 16947

// Pair the two highest numbers in a row of numbers: 818181911112111
const maxJoltage = (bank: number[]) => {
  if (bank.length < 2) {
    return 0
  }
  let tenPtr = 0
  let onePtr = bank.length - 1
  if (bank.length >= 3) {
    for (let i = 1; i < bank.length - 1; i++) {
      if (bank[i]! > bank[tenPtr]!) {
        tenPtr = i
        if (onePtr <= tenPtr) {
          onePtr = tenPtr + 1
        }
      } else if (bank[i!]! > bank[onePtr]!) {
        onePtr = i
      }
    }
  }
  const jolts = bank[tenPtr]! * 10 + bank[onePtr]!
  debug(jolts)
  return jolts
}

const totalJoltage = (grid: number[][]) => {
  return grid.reduce((jolts, bank) => jolts + maxJoltage(bank), 0)
}

const grid: number[][] = []
const lines = await getInput()
lines.forEach((line, y) => {
  grid[y] = line.split("").map(parseNumber)
})

log(`Grid output: ${totalJoltage(grid)}`)
