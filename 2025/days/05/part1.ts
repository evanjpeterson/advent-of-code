import { count, debug, getInput, parseNumber } from "@/common"

/**
 * Advent of Code 2025 Day 5 Part 1
 * https://adventofcode.com/2025/day/5
 */

type FreshIngredientRange = {
  lo: number
  hi: number
}

const freshIdRanges: FreshIngredientRange[] = []
const availableIds: number[] = []

const checkFreshness = (id: number) =>
  freshIdRanges.some(({ lo, hi }) => id >= lo && id <= hi)

await processInput()
const freshIngredientCount = count(availableIds, (id) => checkFreshness(id))
console.log(`${freshIngredientCount} fresh ingredients available`)

async function processInput() {
  let readingRanges = true
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
      // Found the blank line, start reading IDs instead of ranges.
      readingRanges = false
      continue
    }
    if (readingRanges) {
      const [lo, hi] = line.split("-")
      freshIdRanges.push({ lo: parseNumber(lo!), hi: parseNumber(hi!) })
    } else {
      // We could just check freshness here, but that's alright.
      availableIds.push(parseNumber(line))
    }
  }

  // Let's sort the ranges for good measure.
  freshIdRanges.sort((a, b) => a.lo - b.lo)
  debug(freshIdRanges)
}
