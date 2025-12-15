export const _DEBUG = Bun.argv.includes("--debug")

export const debug = (...args: any[]) => {
  if (_DEBUG) {
    console.debug(...args)
  }
}

export const log = console.log

export const getInput = async () => {
  const input = await Bun.stdin.text()
  const lines = input.split("\n").filter(Boolean)
  return lines
}

export const parseNumber = (s: string) => parseInt(s, 10)

export const count = <T>(
  iter: T[],
  cond: (item: T, index: number) => boolean,
) => iter.reduce((sum, item, index) => sum + (cond(item, index) ? 1 : 0), 0)

export const sum = <T>(iter: T[], func: (item: T, index: number) => number) =>
  iter.reduce((sum, item, index) => sum + func(item, index), 0)
