import { getInput, log, parseNumber } from "@/common"

/**
 * Advent of Code 2025 Day 9 Part 1
 * https://adventofcode.com/2025/day/9
 */

type Pos = {
  x: number
  y: number
}

const calcArea = (p1: Pos, p2: Pos) =>
  // We're going to count the rest of the 'tile' beyond the far point for the area calculation.
  // It wouldn't surprise me if there's a proper mathematical term for this.
  (Math.abs(p1.x - p2.x) + 1) * (Math.abs(p1.y - p2.y) + 1)

// Sort points by x, then y.
const points = (await getInput())
  .map((line) => {
    const [x, y] = line.split(",").map(parseNumber)
    return { x: x!, y: y! }
  })
  .sort((p1, p2) => p1.x - p2.x || p1.y - p2.y)

let maxArea = 0
for (let i = 0; i < points.length; i++) {
  for (let j = i + 1; j < points.length; j++) {
    const area = calcArea(points[i]!, points[j]!)
    maxArea = area > maxArea ? area : maxArea
  }
}

log(`Max area: ${maxArea}`)
