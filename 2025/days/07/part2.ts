import assert from "assert"
import { debug, getInput, log } from "@/common"

/**
 * Advent of Code 2025 Day 7 Part 2 (QUANTUM LASER BEAMS!)
 * https://adventofcode.com/2025/day/7#part2
 */

type Cell = "S" | "|" | "^" | "."
type Pos = { x: number; y: number }

const lines = await getInput()
const world = lines.map((line) => line.split(""))
const worldSize: Pos = { x: world[0]!.length, y: world.length }
const source: Pos = { x: world[0]!.indexOf("S"), y: 0 }

const getCell = ({ x, y }: Pos): Cell | undefined =>
  world[y]?.[x] as Cell | undefined

const memory: Partial<Record<string, number>> = {} // Look, it's a brain.
const record = ({ x, y }: Pos, paths: number) => {
  memory[`${x},${y}`] = paths
}
const remember = ({ x, y }: Pos) => {
  return memory[`${x},${y}`]
}

const beam = (from: Pos): number => {
  let paths = remember(from)
  if (paths != null) {
    // "This feels strangely familiar..."
    return paths
  }
  paths = 0
  const target = { x: from.x, y: from.y + 1 }
  switch (getCell(target)) {
    case ".":
      // Only one timeline to follow (for now!).
      paths = beam(target)
      break
    case "^":
      // Time splits here!
      paths =
        beam({ x: from.x - 1, y: from.y }) + beam({ x: from.x + 1, y: from.y })
      break
    case undefined:
      // Out-of-bounds
      if (target.x < 0 || worldSize.x - 1 < target.x) {
        // This isn't a valid timeline, and it ends here.
        paths = 0
        break
      }
      // Beam exits the manifold!
      paths = 1
      break
    default:
      assert(
        false,
        `Found unexpected ${getCell(target)} at ${target.x}, ${target.y}`,
      )
  }

  record(from, paths)
  return paths
}

const paths = beam(source)

log(`The beam traveled ${paths} timelines!`)
