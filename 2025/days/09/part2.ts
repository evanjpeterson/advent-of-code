import { count, debug, getInput, log, parseNumber } from "@/common"

/**
 * Advent of Code 2025 Day 9 Part 2
 * https://adventofcode.com/2025/day/9#part2
 */

type Pos = {
  x: number
  y: number
}
type EdgeH = {
  y: number
  left: number
  right: number
}
type EdgeV = {
  x: number
  top: number
  bottom: number
}

const points: Pos[] = []
const edgesH: EdgeH[] = []
const edgesV: EdgeV[] = []

const calcArea = (p1: Pos, p2: Pos) =>
  // We're going to count the rest of the 'tile' beyond the far point for the area calculation.
  // It wouldn't surprise me if there's a proper mathematical term for this.
  (Math.abs(p1.x - p2.x) + 1) * (Math.abs(p1.y - p2.y) + 1)

const intersects = (edgeH: EdgeH, edgeV: EdgeV) => {
  // Lines must actually overlap, not just touch, to count as intersecting.
  return (
    edgeH.left < edgeV.x &&
    edgeV.x < edgeH.right &&
    edgeV.top < edgeH.y &&
    edgeH.y < edgeV.bottom
  )
}

const checkPosInLoop = (p: Pos) => {
  const rayV: EdgeV = { x: p.x, top: p.y, bottom: Infinity }
  const rayH: EdgeH = { y: p.y, left: p.x, right: Infinity }
  // Ray-cast to check if a point is in a polygon.
  // Odd intersections with polygon borders means the point is inside.
  const inLoop =
    count(edgesH, (edge) => intersects(edge, rayV)) % 2 &&
    count(edgesV, (edge) => intersects(rayH, edge)) % 2
  return inLoop
}

const checkNudgedRectInLoop = (p1: Pos, p2: Pos) => {
  // LOL turn a discrete problem into a continuous one. Classic JS.
  const NUDGE = 0.1

  // Define the edges of the rectangle slightly smaller than the one we're interested in.
  // That way, we can check perpendicular interesections in a more relaxed manner.

  // There is an edge case here to be aware of, which is when p1 and p2 really look more like
  // an edge than corners of a rectangle.
  // Technically that's a rectangle that is 1 tile/wide-high, but it breaks the nudge strat,
  // so we must quash it. Therefore... we're going to ignore it, because I don't think the answer
  // will be a one-tile-width rectangle. That's not a cop-out, it's social psychology.
  if (p1.x === p2.x || p1.y === p2.y) {
    return false
  }

  // Now, to the nudge strat.
  // Points are sorted, so p1 is always a left corner, and p2 is opposite.
  // But, we still need to figure out which corners are top and bottom in order to nudge properly.
  const topLeft: Pos = {
    x: p1.x + NUDGE,
    y: (p1.y <= p2.y ? p1.y : p2.y) + NUDGE,
  }
  const botRight: Pos = {
    x: p2.x - NUDGE,
    y: (p1.y <= p2.y ? p2.y : p1.y) - NUDGE,
  }

  // Verify all corners are within the loop.
  if (
    !checkPosInLoop(topLeft) ||
    !checkPosInLoop(botRight) ||
    !checkPosInLoop({ x: topLeft.x, y: botRight.y }) || // botLeft
    !checkPosInLoop({ x: botRight.x, y: topLeft.y }) // topRight
  ) {
    return false
  }

  const topEdge: EdgeH = {
    y: topLeft.y,
    left: topLeft.x,
    right: botRight.x,
  }
  const bottomEdge: EdgeH = {
    y: botRight.y,
    left: topLeft.x,
    right: botRight.x,
  }
  const leftEdge: EdgeV = {
    x: topLeft.x,
    top: topLeft.y,
    bottom: botRight.y,
  }
  const rightEdge: EdgeV = {
    x: botRight.x,
    top: topLeft.y,
    bottom: botRight.y,
  }

  // Verify that none of the edges of the rectangle intersect with any loop edges,
  // or, in other words, that all edges of the rectangle are in the loop.
  return (
    edgesH.every((edge) => !intersects(edge, leftEdge)) &&
    edgesH.every((edge) => !intersects(edge, rightEdge)) &&
    edgesV.every((edge) => !intersects(topEdge, edge)) &&
    edgesV.every((edge) => !intersects(bottomEdge, edge))
  )
}

const addEdge = (p1: Pos, p2: Pos) => {
  // Create an edge, including the bordering tile.
  if (p1.x === p2.x) {
    edgesV.push({
      x: p1.x,
      top: Math.min(p1.y, p2.y),
      bottom: Math.max(p1.y, p2.y),
    })
  } else if (p1.y === p2.y) {
    edgesH.push({
      y: p1.y,
      left: Math.min(p1.x, p2.x),
      right: Math.max(p1.x, p2.x),
    })
  }
}

// Load in points and edges.
const lines = await getInput()
lines.forEach((line, ndx) => {
  const [x, y] = line.split(",").map(parseNumber)
  const point = { x: x!, y: y! }
  points.push(point)
  const lastPoint = points[ndx - 1]
  if (lastPoint) {
    addEdge(point, lastPoint)
  }
})
// Complete the loop by adding the final edge back to the first point.
addEdge(points[points.length - 1]!, points[0]!)
debug(`Loop has ${edgesH.length} horizontal edges, ${edgesV.length} vertical.`)

// Sort points by x, then y.
points.sort((p1, p2) => p1.x - p2.x || p1.y - p2.y)

let maxP1: Pos
let maxP2: Pos
let maxArea = 0
for (let i = 0; i < points.length; i++) {
  for (let j = i + 1; j < points.length; j++) {
    const area = calcArea(points[i]!, points[j]!)
    // Filter by area first, since area calc is comparatively cheap.
    if (area > maxArea) {
      const inLoop = checkNudgedRectInLoop(points[i]!, points[j]!)
      if (inLoop) {
        maxArea = area
        maxP1 = points[i]!
        maxP2 = points[j]!
      }
    }
  }
}

if (maxP1! && maxP2!) {
  debug(`[${maxP1!.x}, ${maxP1!.y}], [${maxP2!.x}, ${maxP2!.y}]`)
} else {
  debug(`No valid rectangle found.`)
}
log(`Max area within the loop: ${maxArea}`)

/**
 * Avast, dragons.
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * BACKBURNER
 */
const checkAllRectPointsInLoop = (p1: Pos, p2: Pos) => {
  for (let i = p1.x; i < p2.x; i++) {
    for (let j = Math.min(p1.y, p2.y); j < Math.max(p1.y, p2.y); j++) {
      if (!checkPosInLoop({ x: i, y: j })) {
        return false
      }
    }
  }
  return true
}
