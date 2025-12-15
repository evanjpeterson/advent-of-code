import assert from "assert"
import { debug, getInput, parseNumber, sum } from "@/common"

/**
 * Advent of Code 2025 Day 5 Part 2
 * https://adventofcode.com/2025/day/5#part2
 */

type FreshIngredientRange = {
  lo: number
  hi: number
}

const freshIdRanges: FreshIngredientRange[] = []

await processInput()
const freshIdCount = sum(
  freshIdRanges,
  ({ lo, hi }) => hi - lo + 1 /* inclusive range */,
)
console.log(`${freshIdCount} fresh ingredients IDs`)

async function processInput() {
  for (const line of await getInput({ keepEmpty: true })) {
    /**
     * Input looks like:
     *
     * ##-##  <fresh Ingredient ID ranges>
     * ...
     *          <blank line>
     * ##      <available ingredient IDs>
     * ...
     */
    if (!line.trim()) {
      // Found the blank line, and for part 2 we don't care about individual IDs.
      break
    }
    const [lo, hi] = line.split("-")
    const range = { lo: parseNumber(lo!), hi: parseNumber(hi!) }
    assert(range.lo <= range.hi, `Sneaky input alert! ${line}`)
    freshIdRanges.push(range)
  }

  // Let's sort the ranges for good measure.
  freshIdRanges.sort((a, b) => a.lo - b.lo)

  // Now, let's get nerdy.
  // We want to remove any overlap in the ranges.
  // That would be easy enough if the ranges only ever overlapped partially,
  // but if any range fully contains other ranges, those other ranges should be thrown out.

  for (let ndx = 0; ndx < freshIdRanges.length; ndx++) {
    const current = freshIdRanges[ndx]!

    // We already sorted by |lo| values, so |lo| is guaranteed to be <= to any following ranges.
    // Find and correct overlaps by checking where the |hi| value falls within following ranges.
    // Once |hi| is less than the |lo| of a following range, it's OK to move on.
    let next = freshIdRanges[ndx + 1]
    while (next && current.hi >= next.hi) {
      // The current range contains the following range. Throw out the following range.
      freshIdRanges.splice(ndx + 1, 1)
      next = freshIdRanges[ndx + 1]
    }
    if (!next || current.hi < next.lo) {
      // No overlap with the next range (and there may not be a next range).
      continue
    }

    if (current.hi >= next.lo) {
      // There's some amount of overlap with the next range.
      // Adjust the current range to compensate.
      current.hi = next.lo - 1
      if (current.hi < current.lo) {
        // "I'll see myself out."
        freshIdRanges.splice(ndx, 1)
        ndx -= 1 // will get incremented right after
      }
      continue
    }
  }

  debug(freshIdRanges)
}
