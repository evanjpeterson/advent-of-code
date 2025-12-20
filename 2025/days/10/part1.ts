import { binstr, debug, getInput, log, parseNumber, sum } from "@/common"

type Machine = {
  lights: number
  buttons: number[]
}

type Task = {
  start: number
  presses: number
}

type State = {
  seen: {
    // Mapping of lights state to button presses required to get there.
    [n: number]: number
  }
  tasks: Task[]
}

const machines: Machine[] = (await getInput()).map(parseMachine)
log(`Total button presses: ${sum(machines, solveMachine)}`)

function solveMachine(machine: Machine, ndx: number) {
  // Load up the initial task (lights all start OFF, no button presses yet).
  const tasks: Task[] = [{ start: 0, presses: 0 }]
  const state: State = {
    seen: { 0: 0 },
    tasks,
  }
  let tasksRun = 0
  while (tasks.length) {
    runTask(machine, state, tasks.shift()!)
    tasksRun++
    if (state.seen[machine.lights]) {
      debug(
        `Machine ${ndx} solved in ${tasksRun} tasks (${state.seen[machine.lights]} presses).`,
      )
      break
    }
  }
  const minPresses = state.seen[machine.lights] ?? Infinity
  debug(`Machine ${ndx} ran ${tasksRun} tasks. Presses: ${minPresses}`)
  return minPresses
}

function runTask(
  { lights, buttons }: Machine,
  { seen, tasks }: State,
  { start, presses }: Task,
) {
  if (seen[lights] && seen[lights] <= presses) {
    // A solution has already been found, and we won't beat it.
    // No need to continue down this path.
    return
  }
  if (seen[start] && seen[start] < presses) {
    // This arrangement of lights has already been seen in fewer button presses.
    // No need to continue.
    return
  }
  for (const button of buttons) {
    // Push the button, check the lights.
    const next = start ^ button
    if (seen[next] == null || seen[next] > presses + 1) {
      seen[next] = presses + 1
    }
    tasks.push({ start: next, presses: presses + 1 })
  }
}

function parseMachine(line: string) {
  // Parse lights array into a bitfield.
  // [#.#..#]
  const match = line.match(/\[([.#]+)\]/)
  const lStr = match![1]!
  let lights = 0
  for (const c of lStr.split("")) {
    // '#' is an ON light, and '.' is OFF
    lights |= c === "#" ? 1 : 0
    lights <<= 1
  }
  lights >>= 1

  // Parse button array into bitfields.
  // Buttons look like (3) or (1, 2, 5)
  const matches = line.matchAll(/\(([0-9,]+)\)/g)
  const buttons = []
  for (const match of matches) {
    const numbers = match[1]!.split(",").map(parseNumber)
    const lightEdge = 1 << (lStr.length - 1)
    let button = 0
    // Each number in the button's list represents an index into the lights bitfield.
    // But, we'll flip the way button bits are loaded in to match up with the lights.
    for (const n of numbers) {
      button |= lightEdge >> n
    }
    buttons.push(button)
  }

  // TODO: Parse the joltage requirements array in Part 2

  return {
    lights,
    buttons,
  }
}

function debugMachine(machine: Machine) {
  debug("lights")
  debug(binstr(machine.lights))
  debug("buttons")
  for (const button of machine.buttons) {
    debug(binstr(button))
  }
}
