import assert from "assert"
import { debug, getInput, log } from "@/common"

/**
 * Advent of Code 2025 Day 2 Part 2 (brute force, I guess, but with math)
 * https://adventofcode.com/2025/day/2#part2
 */

const getNumDigits = (num: number) => Math.floor(Math.log10(num)) + 1

const repeatsWithSize = (num: number, numDigits: number, seqSize: number) => {
  if (numDigits % seqSize) {
    // Sequences of the given size don't perfectly fill this number of digits.
    return false
  }

  // Get the lowest |seqSize| digits.
  const first = num % Math.pow(10, seqSize)
  for (let i = seqSize; i < numDigits; i += seqSize) {
    // Compare the next chunks of |seqSize| digits to the first.
    const next = Math.trunc(num / Math.pow(10, i)) % Math.pow(10, seqSize)
    if (next != first) {
      return false
    }
  }
  return true
}

const repeats = (num: number) => {
  const numDigits = getNumDigits(num)
  if (numDigits <= 1) {
    // Need at least two digits for a sequence.
    return false
  }
  if (numDigits == 2) {
    // Math.
    return num % 11 === 0
  }
  for (let seqSize = Math.floor(numDigits / 2); seqSize > 0; seqSize--) {
    if (repeatsWithSize(num, numDigits, seqSize)) {
      return true
    }
  }

  return false
}

const sumRange = (lo: number, hi: number) => {
  let sum = 0
  for (let num = lo; num <= hi; num++) {
    if (repeats(num)) {
      debug(` Found: ${num}`)
      sum += num
    }
  }

  return sum
}

const sumInvalidIds = async () => {
  const lines = await getInput()
  assert(lines.length === 1, "Unexpected number of lines of input.")
  const idRanges = lines[0]!
    .split(",")
    .map((range) => range.split("-").map(Number))

  let invalidIdSum = 0

  for (const [lo, hi] of idRanges) {
    assert(lo && hi, `Invalid range: ${lo}-${hi}`)
    debug(`Range ${lo}-${hi}`)
    invalidIdSum += sumRange(lo, hi)
  }

  return invalidIdSum
}

log(`Sum of invalid IDs: ${await sumInvalidIds()}`)
