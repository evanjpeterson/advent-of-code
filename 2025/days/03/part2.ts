import { debug, getInput, log, parseNumber } from "@/common"

/**
 * Advent of Code 2025 Day 3 Part 2
 * https://adventofcode.com/2025/day/3#part2
 */

// High:  168893382458726
// Goldy:
// Low:   168591803351227
//        168587346947226
//        168587356647226
//        168591803351227

const NUM_TO_SELECT = 12

const sortOption = (jolts: number, options: number[]) => {
  // Sort options by jolts, and implicitly by position, ASSUMING we're checking options in order.
  // Better options have higher jolts, low position.
  let i
  for (i = 0; i < NUM_TO_SELECT; i++) {
    // Sort in the current option.
    if (options[i] == null || jolts > options[i]!) {
      // Found a better option.
      options[i] = jolts
      // Throw away any previous options with a lower value than this one.
      // This option is better than those ones put together.
      options.length = i + 1
      break
    }
  }
}

const removeLowest = (options: number[], from: number) => {
  // Remove the lowest value at the earliest position from the list, but after the |from| index.
  const target = options.slice(from)
  const index = target.indexOf(Math.min(...target))
  const removed = options.splice(from + index, 1)
  return { removed: removed[0], at: from + index }
}

// Join the NUM_TO_SELECT highest numbers in a row of numbers: 818181911112111
const maxJoltage = (bank: number[]) => {
  if (bank.length < NUM_TO_SELECT) {
    // Bad input.
    debug(`Found bank with less than ${NUM_TO_SELECT} batteries.`)
    return 0
  }

  const selected: number[] = bank.slice(-NUM_TO_SELECT)
  const bestOptions: number[] = []
  // Check all options up until the last NUM_TO_SELECT, which act as the default selection.
  for (let i = 0; i < bank.length - NUM_TO_SELECT; i++) {
    sortOption(bank[i]!, bestOptions)
  }

  let totalJolts = 0

  debug(
    `Best options: ${bestOptions.join("")} | Initial selection: ${selected.join("")}`,
  )

  // Decide whether to trade default selections for the best options we could find.
  for (let i = 0; i < NUM_TO_SELECT; i++) {
    if (bestOptions.length) {
      const option = bestOptions.shift()!
      if (option >= selected[i]!) {
        //debug(selected.join(""))
        // Trade for an option if it has a higher value or a lower position
        // (all |bestOptions| have lower positions than the default selection, so focus on the value).
        removeLowest(selected, i)
        selected.splice(i, 0, option)
        //debug(selected.join("") + ` removed ${removed} at pos ${at}`)
        //debug("***")
      } else {
        // Default selection is better than remaining options, which no longer need to be considered.
        //debug(`Keeping ${selected[i]}. Done.`)
        bestOptions.length = 0
      }
    }
    totalJolts += selected[i]! * Math.pow(10, NUM_TO_SELECT - i - 1)
  }

  return totalJolts
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
