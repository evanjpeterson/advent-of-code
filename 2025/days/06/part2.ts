import { getInput, log, parseNumber, rotateMx90L, sum } from "@/common"

/**
 * Advent of Code 2025 Day 6 Part 2 (a wild matrix appears!)
 * https://adventofcode.com/2025/day/6#part2
 */

type Operation = "+" | "*"

const lines = await getInput()
const ops = lines.pop()!.trim().split(/\s+/).reverse() as Operation[]
const solns: number[] = ops.map((op) => (op === "+" ? 0 : 1))

const charMx = lines.map((line) => line.split(""))
const nums = rotateMx90L(charMx).map((row) => parseNumber(row.join("").trim()))
for (let problem = 0; problem < ops.length; problem++) {
  const op = ops[problem]
  while (!isNaN(nums[0]!)) {
    if (op === "+") {
      solns[problem]! += nums[0]!
    } else if (op === "*") {
      solns[problem]! *= nums[0]!
    }
    nums.shift()
  }
  nums.shift() // NaN
}

log(`Grand total: ${sum(solns, (soln) => soln)}`)
