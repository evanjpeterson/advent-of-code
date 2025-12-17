import { _DEBUG, debug, getInput, log, parseNumber } from "@/common"

/**
 * Advent of Code 2025 Day 8 Part 1
 * https://adventofcode.com/2025/day/8
 */

// Confusingly, there seems to be a number of connections to make depending on the input,
// yet for some reason this number hasn't been included as part of the input itself.
//
// So, I went ahead and added the number of connections to make as the first line of the input files.
let connectionsToMake = 0
let connectionsMade = 0

type JunctionBox = {
  x: number
  y: number
  z: number
  key: string
}

type Circuit = JunctionBox["key"][]

// Using Squared Euclidean distance.
// Tried Taxicab distance first, but results were off.
const calcDistance = (boxA: JunctionBox, boxB: JunctionBox) =>
  (boxA.x - boxB.x) ** 2 + (boxA.y - boxB.y) ** 2 + (boxA.z - boxB.z) ** 2

/**
 * A beautifully planned taxicab
 *
 * Math.abs(boxA.x - boxB.x) +
 * Math.abs(boxA.y - boxB.y) +
 * Math.abs(boxA.z - boxB.z)
 */

const getPairKey = (keyA: string, keyB: string) => [keyA, keyB].sort().join(":")
const splitPairKey = (pairKey: string) => pairKey.split(":")
const pairDistances: Partial<Record<string, number>> = {}

const circuits: Circuit[] = []
const connected: Partial<Record<string, Circuit>> = {}
const addToCircuit = (circuit: Circuit, ...keys: JunctionBox["key"][]) => {
  if (circuit.length === 0) {
    // We have a brand new circuit!
    circuits.push(circuit)
  }
  // Connect junction boxes to the circuit.
  circuit.push(...keys)
  for (const key of keys) {
    // Track which circuits the boxes are connected to.
    connected[key] = circuit
  }
}
const mergeCircuits = (circuitA: Circuit, circuitB: Circuit) => {
  // Circuit A and Circuit B become one (well, they become Circuit A).
  // Point all of the Circuit B's boxes at Circuit A.
  circuitB.forEach((key) => {
    connected[key] = circuitA
  })
  // Merge all of Circuit B's boxes into Circuit A.
  circuitA.push(...circuitB)
  // Circuit B is no more.
  circuits.splice(circuits.indexOf(circuitB), 1)
}
const connect = (boxA: JunctionBox["key"], boxB: JunctionBox["key"]) => {
  if (!connected[boxA] && !connected[boxB]) {
    // Neither box is connected to a circuit yet. Make a new one!
    addToCircuit([], boxA, boxB)
  } else if (connected[boxA] && !connected[boxB]) {
    // Connect box B to A's circuit.
    addToCircuit(connected[boxA], boxB)
  } else if (!connected[boxA] && connected[boxB]) {
    // Connect box A to box B's circuit.
    addToCircuit(connected[boxB], boxA)
  } else if (connected[boxA] === connected[boxB]) {
    // Both boxes are already connected to the same circuit.
    // IMPORTANT: This still counts as making a connection for the sake of the puzzle.
  } else {
    mergeCircuits(connected[boxA]!, connected[boxB]!)
  }

  connectionsMade += 1
}

// Parse in coordinate data from the input file.
// The coordinates string also functions an ID.
const lines = await getInput()
connectionsToMake = parseNumber(lines.shift()!)

const boxes = lines.map((coords): JunctionBox => {
  const [x, y, z] = coords
    .split(",")
    .map(parseNumber)
    .filter((n) => n != null)
  return {
    x: x!,
    y: y!,
    z: z!,
    key: coords,
  }
})

// Calculate distances between all pairs of junction boxes.
// This is still O(n^2), but hey, it's at least a little more efficient.
// Use a sorted, paired key to track measure distances in a flat hashmap.
for (let i = 0; i < boxes.length; i++) {
  const boxA = boxes[i]!
  for (let j = i + 1; j < boxes.length; j++) {
    const boxB = boxes[j]!
    const key = getPairKey(boxA.key, boxB.key)
    pairDistances[key] = calcDistance(boxA, boxB)
  }
}

// Sort the pairs of boxes by shortest distance, then start adding them to circuits.
Object.entries(pairDistances)
  .sort(([_, distA], [__, distB]) => distA! - distB!)
  .forEach(([pairKey]) => {
    if (connectionsMade >= connectionsToMake) {
      return
    }

    debug(`Connecting ${pairKey} (#${connectionsMade + 1})`)
    const boxes = splitPairKey(pairKey)
    connect(boxes[0]!, boxes[1]!)
  })

// At this point we have our circuits set up.
// Sort by circuit size, then do some arbitrary math (multiply three largest circuit sizes together).
const result = circuits
  .sort((a, b) => b.length - a.length)
  .slice(0, 3)
  .reduce((acc, { length }) => length * acc, 1)

if (_DEBUG) {
  circuits.forEach((circuit) => debug(circuit.join(", ")))
}

log(`Survey says... ${result}`)
