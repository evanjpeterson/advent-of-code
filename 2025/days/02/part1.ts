import assert from "assert"
import { debug, getInput, log } from "@/common"

/**
 * Advent of Code 2025 Day 2 Part 1
 * https://adventofcode.com/2025/day/2
 */

const checkInvalid = (id: number) => {
  // Invalid IDs are sequences of digits repeated twice.
  // So, they must have an even number of digits.
  const idStr = String(id)
  const numDigits = idStr.length
  if (numDigits % 2) {
    return false
  }

  // Do the two halves match?
  return idStr.slice(0, numDigits / 2) === idStr.slice(numDigits / 2)
}

const sumInvalidIds = async () => {
  const lines = await getInput()
  assert(lines.length === 1, "Unexpected number of lines of input.")
  const idRanges = lines[0]!
    .split(",")
    .map((range) => range.split("-").map(Number))

  let invalidIdSum = 0
  let idCount = 0

  for (const [lo, hi] of idRanges) {
    assert(lo && hi && lo < hi, `Invalid range: ${lo}-${hi}`)
    debug(`Range ${lo}-${hi} (${hi - lo + 1} IDs)`)
    for (let i = lo; i <= hi; i++, idCount++) {
      if (checkInvalid(i)) {
        debug(`Invalid: ${i}`)
        invalidIdSum += i
      }
    }
  }

  debug(`Checked ${idCount} IDs`)
  return invalidIdSum
}

// Prediction: Part 2 will bring this all crumbling down.
log(`Sum of invalid IDs: ${await sumInvalidIds()}`)
