import assert from "assert"
import { debug, getInput, log } from "@/common"

/**
 * Advent of Code 2025 Day 2 Part 2
 * https://adventofcode.com/2025/day/2#part2
 */

const possibleSequenceLengths = (numDigits: number) =>
  // Find factors of |numDigits| (which lengths divide evenly into it?)
  Array.from({ length: Math.floor(numDigits / 2) }, (_, i) => i + 1).filter(
    (l) => numDigits % l === 0,
  )

const repeatSequence = (seq: number, seqLen: number, repeats: number) => {
  let id = 0
  // e.g. |seq| is 123, |seqLen| must be 3, |repeats| is 3
  // -> 123 * 10^6 + 123 * 10^3 + 123 * 10^0
  // -> 123123123
  for (let x = repeats - 1; x >= 0; x--) {
    id += seq * Math.pow(10, seqLen * x)
  }
  return id
}

const sumInvalidIdsOfSequenceLength = (
  seqLen: number,
  repeats: number,
  lo: number,
  hi: number,
) => {
  debug(`  Checking sequences of ${seqLen}.`)
  let sum = 0

  // Find the first sequence to check.
  //   |seqLen| 1: start at 1, |seqLen| 4, start at 1000
  // This could be optimized to start with the first |seqLen| digits of |lo|,
  // since a lot of these values are going to be lower than |lo|,
  // but let's keep it a bit simpler. IDs can't start with a leading 0, so lead with 1.
  let seq = Math.pow(10, seqLen - 1)
  // |maxSeq| is the number at which the sequence length would increase,
  // but our goal here is to check sequences of just the one length.
  let maxSeq = seq * 10
  let id = repeatSequence(seq, seqLen, repeats)

  while (seq < maxSeq && id < hi) {
    if (id >= lo && id <= hi) {
      // The sequence is in-bounds, so it is an 'invalid' ID (within the valid range :)
      sum += id
      debug(`   Found: ${id}`)
    }
    seq += 1
    id = repeatSequence(seq, seqLen, repeats)
  }
  // Either the last ID was out-of-range (no need to check any further, as IDs would keep getting larger),
  // or we ran out of sequence patterns to check.

  // Return the sum of invalid IDs found in this range.
  return sum
}

const sumInvalidIdsInRange = (loStr: string, hiStr: string) => {
  const lo = Number(loStr)
  const hi = Number(hiStr)
  const loDigits = loStr.length
  const hiDigits = hiStr.length

  // It's possible to have a range like [10, 1234] with differing digits.
  // In this case, 11, 111, 1111 are all 'invalid' IDs. Each possible digit-amount must be checked.
  let sum = 0
  for (let numDigits = loDigits; numDigits <= hiDigits; numDigits++) {
    debug(` Considering IDs with ${numDigits} digits.`)
    possibleSequenceLengths(numDigits).forEach((seqLen) => {
      sum += sumInvalidIdsOfSequenceLength(seqLen, numDigits / seqLen, lo, hi)
    })
  }

  // Return the sum of invalid IDs found in this range, for all possible numbers of digits.
  return sum
}

const sumInvalidIds = async () => {
  const lines = await getInput()
  assert(lines.length === 1, "Unexpected number of lines of input.")
  const idRanges = lines[0]!.split(",").map((range) => range.split("-"))

  let invalidIdSum = 0

  for (const [lo, hi] of idRanges) {
    assert(lo && hi, `Invalid range: ${lo}-${hi}`)
    debug(`Range ${lo}-${hi}`)
    invalidIdSum += sumInvalidIdsInRange(lo, hi)
  }

  return invalidIdSum
}

log(`Sum of invalid IDs: ${await sumInvalidIds()}`)
