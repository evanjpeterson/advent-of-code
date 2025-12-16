import assert from "assert"
import { debug, getInput, log, sum, times } from "@/common"

/**
 * Advent of Code 2025 Day 7 Part 1 (LASER BEAMS!)
 * https://adventofcode.com/2025/day/7
 */

type Cell = "S" | "|" | "^" | "."
type Pos = { x: number; y: number }

const lines = await getInput()
const world = lines.map((line) => line.split(""))
const source: Pos = { x: lines[0]!.indexOf("S"), y: 0 }
const beams: Pos[] = [source]
const splitters: Pos[] = []

const getCell = ({ x, y }: Pos): Cell | undefined => {
  return world[y]?.[x] as Cell | undefined
}

const setCell = ({ x, y }: Pos, c: Cell) => {
  world[y]![x]! = c
}

const propagateBeam = (target: Pos) => {
  const cell = getCell(target)
  switch (getCell(target)) {
    case ".":
      // Send the beam to the target cell!
      setCell(target, "|")
      return target
    case "^":
      // Found a splitter!
      splitters.push(target)
      return null
    case "|":
      // Found another beam!
      return null
    case undefined:
      // Out-of-bounds, that's alright!
      return null
    default:
      assert(false, `Found unexpected '${cell}' at ${target.x}, ${target.y}`)
  }
}

const splitBeam = ({ x, y }: Pos) => {
  // Split the beam horizontally
  const newBeams = [
    propagateBeam({ x: x - 1, y }),
    propagateBeam({ x: x + 1, y }),
  ].filter((b) => b != null)
  beams.push(...newBeams)
}

const updateBeams = () => {
  const newBeams = beams
    .map(({ x, y }) => propagateBeam({ x, y: y + 1 }))
    .filter((b) => b != null)
  beams.length = 0
  beams.push(...newBeams)
}

const updateSplitters = () => {
  const splitCount = splitters.length
  splitters.map(splitBeam)
  assert(splitters.length === splitCount, "Discovered adjacent splitters!")
  splitters.length = 0
  return splitCount
}

const updateWorld = () => {
  updateBeams()
  const splitCount = updateSplitters()
  return splitCount
}

const splitCount = sum(lines, updateWorld)

debug(world.map((row) => row.join("")).join("\n"))
log(`The beam split ${splitCount} times!`)
