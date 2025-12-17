import { _DEBUG, debug, getInput, log, parseNumber } from "@/common"

/**
 * Advent of Code 2025 Day 8 Part 2
 * https://adventofcode.com/2025/day/8
 */

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
  } else {
    // Only one will survive.
    mergeCircuits(connected[boxA]!, connected[boxB]!)
  }
}

// Parse in coordinate data from the input file.
// The coordinates string also functions an ID.
const lines = await getInput()
parseNumber(lines.shift()!) // # connections to make (Part 1 only)

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

// Calculate distances between all pairs of junction boxes, without repeating any pairs.
// Use a sorted, paired key to track measure distances in a flat hashmap.
// This is still O(n^2), but hey, it's hopefully at least a little more efficient.
for (let i = 0; i < boxes.length; i++) {
  const boxA = boxes[i]!
  for (let j = i + 1; j < boxes.length; j++) {
    const boxB = boxes[j]!
    const key = getPairKey(boxA.key, boxB.key)
    pairDistances[key] = calcDistance(boxA, boxB)
  }
}

let result: number | null = null
// Sort the pairs of boxes by shortest distance, then start adding them to circuits.
Object.entries(pairDistances)
  .sort(([_, distA], [__, distB]) => distA! - distB!)
  .forEach(([pairKey]) => {
    if (result != null) {
      return
    }

    debug(`Connecting ${pairKey}`)
    const [boxA, boxB] = splitPairKey(pairKey)
    connect(boxA!, boxB!)

    if (circuits[0]?.length === boxes.length) {
      // We want all of the junction boxes in a single circuit.
      // Once that happens, we want to do some arbitrary math with the last two boxes we connected.
      // Specifically, multiply their x-coordinates together. Alrighty.
      result =
        parseNumber(boxA!.split(",")[0]!) * parseNumber(boxB!.split(",")[0]!)
    }
  })

if (_DEBUG) {
  circuits.forEach((circuit) => debug(circuit.join(", ")))
}

log(`Here's the answer: ${result}`)
