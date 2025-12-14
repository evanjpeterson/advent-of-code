import { debug, getInput, log, parseNumber } from "@/common"

/**
 * Advent of Code 2025 Day 3 Part 2 (cleaner greedy)
 * https://adventofcode.com/2025/day/3#part2
 */

const NUM_TO_SELECT = 12

const indexOfMax = (nums: number[], from: number, to: number) => {
  const slice = nums.slice(from, to)
  const max = Math.max(...slice)
  return from + slice.indexOf(max)
}

const maxJoltage = (bank: number[]) => {
  const picks = []
  let start = 0
  while (picks.length < NUM_TO_SELECT) {
    // Always leave enough room at the end to fill in picks completely (with NUM_TO_SELECT values).
    const remainingToSelect = NUM_TO_SELECT - picks.length
    // Find the index of the biggest value in the range.
    // We're picking one value in the range, so the window at the end will have one less than the total that still need to be selected.
    const maxIndex = indexOfMax(
      bank,
      start,
      bank.length - (remainingToSelect - 1),
    )
    picks.push(bank[maxIndex])
    start = maxIndex + 1
  }
  return parseNumber(picks.join(""))
}

const totalJoltage = (grid: number[][]) => {
  return grid.reduce((jolts, bank, y) => {
    const bankJoltage = maxJoltage(bank)
    debug(`Bank ${y}: ${bankJoltage}`)
    return jolts + bankJoltage
  }, 0)
}

const grid: number[][] = []
const lines = await getInput()
lines.forEach((line, y) => {
  grid[y] = line.split("").map(parseNumber)
})

log(`Grid output: ${totalJoltage(grid)}`)
