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

export const rotateMx90R = (mx: any[][]) => {
  /**
   * 1 2 -> 3 1
   * 3 4 -> 4 2
   */
  return mx[0]!.map((_, colIndex) => mx.map((row) => row[colIndex]).reverse())
}
export const rotateMx90L = (mx: any[][]) => {
  /**
   * 1 2 -> 2 4
   * 3 4 -> 1 3
   */
  return mx[0]!.map((_, colIndex) =>
    mx.map((row) => row[row.length - 1 - colIndex]),
  )
}
