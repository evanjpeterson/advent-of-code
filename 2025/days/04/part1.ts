import { _DEBUG, count, debug, getInput, log, sum } from "@/common"

/**
 * Advent of Code 2025 Day 4 Part 1
 * https://adventofcode.com/2025/day/4
 */

type Spot = {
  stuff: string
}
type Shelves = Spot[][]

// If a spot has at most this many neighbors, it is considered accessible.
const MAX_NEIGHBORS = 3

// prettier-ignore
const neighbors = (x: number, y: number) => [
    [x-1, y-1], [x, y-1], [x+1, y-1],
    [x-1, y], /* spot */  [x+1, y],
    [x-1, y+1], [x, y+1], [x+1, y+1],
  ]

const spot = (shelves: Shelves, x: number, y: number) =>
  shelves[y]?.[x] ?? { stuff: "" }

const hasAccessibleStuff = (shelves: Shelves, x: number, y: number) =>
  spot(shelves, x, y).stuff !== "" &&
  count(
    neighbors(x, y).map(([x, y]) => spot(shelves, x!, y!).stuff),
    (stuff) => stuff !== "",
  ) <= MAX_NEIGHBORS

const shelves: Shelves = (await getInput()).map((line) =>
  line.split("").map((c) => ({
    stuff: c === "." ? "" : c,
  })),
)

const accessibleSpots = sum(shelves, (shelf, y) =>
  count(shelf, (_, x) => hasAccessibleStuff(shelves, x, y)),
)

if (_DEBUG) {
  const debugShelves = () =>
    shelves.forEach((shelf, y) => {
      debug(
        shelf
          .map(({ stuff }, x) =>
            hasAccessibleStuff(shelves, x, y) ? "x" : stuff ? stuff : ".",
          )
          .join(""),
      )
    })
  debugShelves()
}

log(`# Forklift-accessible spots: ${accessibleSpots}`)
