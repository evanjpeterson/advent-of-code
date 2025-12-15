import { count, getInput, log, sum } from "@/common"

/**
 * Advent of Code 2025 Day 4 Part 2 (to heck with optimizing early)
 * https://adventofcode.com/2025/day/4#part2
 */

type Spot = {
  stuff: string
  x: number
  y: number
}
type Shelves = Spot[][]

// If a spot has at most this many neighbors, it is considered accessible.
const MAX_NEIGHBORS = 3

const getSpot = (shelves: Shelves, x: number, y: number) =>
  shelves[y]?.[x] ?? { stuff: "", x, y }

// prettier-ignore
const getNeighbors = (shelves: Shelves, { x, y }: Spot) => [
  [x-1, y-1], [x, y-1], [x+1, y-1],
  [x-1, y], /* spot */  [x+1, y],
  [x-1, y+1], [x, y+1], [x+1, y+1],
].map(([x, y]) => getSpot(shelves, x!, y!))

const hasAccessibleStuff = (shelves: Shelves, spot: Spot) =>
  spot.stuff !== "" &&
  count(getNeighbors(shelves, spot), ({ stuff }) => stuff !== "") <=
    MAX_NEIGHBORS

const getAccessibleSpots = (shelves: Shelves) =>
  shelves.reduce((spots, shelf) => {
    shelf.forEach((spot) => {
      if (hasAccessibleStuff(shelves, spot)) {
        spots.push(spot)
      }
    }, spots)

    return spots
  }, [] as Spot[])

const removeStuff = (spots: Spot[]) => {
  spots.forEach((spot) => (spot.stuff = ""))
  return spots.length
}

const cleanUpShelves = async () => {
  const shelves: Shelves = (await getInput()).map((line, y) =>
    line.split("").map((c, x) => ({
      stuff: c === "." ? "" : c,
      x,
      y,
    })),
  )

  let totalRemoved = 0
  let removed = removeStuff(getAccessibleSpots(shelves))
  while (removed > 0) {
    totalRemoved += removed
    removed = removeStuff(getAccessibleSpots(shelves))
  }

  log(`# Forklift-accessible spots: ${totalRemoved}`)
}

cleanUpShelves()
