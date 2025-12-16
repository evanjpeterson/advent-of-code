import assert from "assert"
import { getInput, log, parseNumber, sum } from "@/common"

/**
 * Advent of Code 2025 Day 6 Part 1
 * https://adventofcode.com/2025/day/6
 */

type Operation = "+" | "*"

const lines = await getInput()
const ops = lines.pop()!.split(/\s+/) as Operation[]
const solns: number[] = ops.map((op) => (op === "+" ? 0 : 1))

lines.forEach((line) => {
  const nums = line.trim().split(/\s+/).map(parseNumber)
  assert(nums.length === ops.length, "Some problems are missing numbers.")
  nums.forEach((num, ndx) => {
    if (ops[ndx] === "+") {
      solns[ndx]! += num
    } else if (ops[ndx] === "*") {
      solns[ndx]! *= num
    }
  })
})

log(`Grand total: ${sum(solns, (soln) => soln)}`)
