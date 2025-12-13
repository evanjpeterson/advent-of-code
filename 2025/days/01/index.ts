import { debug, log, getInput } from "@/common/index.ts"

/**
 * Advent of Code 2025 Day 1
 * https://adventofcode.com/2025/day/1
 */

// Too low: 6835
// Goldy: 6858
// Too high: 6951

const turn = (dial: number, num: number) => {
  let next = dial + num

  // How many times was zero passed as a result of this turn?
  let zeroes = Math.trunc(Math.abs(next) / 100)
  if (next <= 0 && dial > 0) {
    // Add an extra zero-count for going from positive to negative (looping around to the left).
    zeroes += 1
  }

  // Handle turning past 99
  next = next % 100
  // Handle turning past 0
  if (next < 0) {
    next = 100 + next
  }
  return { next, zeroes }
}
const left = (dial: number, num: number) => turn(dial, -num)
const right = (dial: number, num: number) => turn(dial, num)

const getPassword = async () => {
  const lines = await getInput()

  let dial = 50
  let zeroCount = 0

  for (const line of lines) {
    const direction = line[0]
    const amount = parseInt(line.slice(1))
    let result: { next: number; zeroes: number } | undefined
    if (direction === "L") {
      result = left(dial, amount)
    } else if (direction === "R") {
      result = right(dial, amount)
    }
    if (result) {
      const { next, zeroes } = result
      dial = next
      zeroCount += zeroes
      debug(
        `The dial is rotated ${line} to point at ${next}${zeroes > 0 ? `; during this rotation, it points at 0 ${zeroes} time(s)` : ""}.`,
      )
    }
  }

  return zeroCount
}

const pw = await getPassword()
log(`Password: ${pw}`)
