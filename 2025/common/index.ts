export const _DEBUG = Bun.argv.includes("--debug")

export const debug = (...args: any[]) => {
  if (_DEBUG) {
    console.debug(...args)
  }
}

export const log = console.log

export const getInput = async ({
  keepEmpty,
}: {
  keepEmpty?: true
} = {}) => {
  const input = await Bun.stdin.text()
  const lines = input.split("\n")
  return keepEmpty ? lines : lines.filter(Boolean)
}

export const parseNumber = (s: string) => parseInt(s, 10)

export const count = <T>(
  iter: T[],
  cond: (item: T, index: number) => boolean,
) => iter.reduce((sum, item, index) => sum + (cond(item, index) ? 1 : 0), 0)

export const sum = <T>(iter: T[], func: (item: T, index: number) => number) =>
  iter.reduce((sum, item, index) => sum + func(item, index), 0)
