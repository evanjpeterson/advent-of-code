const _DEBUG = Bun.argv.includes("--debug")

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
