import { isNotNullOrUndefined } from '..'

export function parseEnvNumber<T extends number | undefined, TOptional extends boolean = false>(
  prop: string,
  opts?: { readonly defaultValue?: T, readonly optional?: TOptional},
  env = process.env,
): TOptional extends false ? number : (T extends number ? number : number | undefined) {
  const rawValue = env[prop]
  if (!rawValue) {
    const defaultValue = opts?.defaultValue
    if (isNotNullOrUndefined(defaultValue)) {
      return defaultValue as number
    }

    if (opts?.optional) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return undefined
    }

    throw new Error(`Environment variable "${prop}" is required`)
  }
  try {
    return parseFloat(rawValue)
  } catch (e) {
    throw new Error(`Failed to parse environment variable "${prop}", expected number got "${rawValue}"`)
  }
}

export function parseEnvJSON<T extends unknown | undefined, TOptional extends boolean = false>(
  prop: string,
  opts?: { readonly defaultValue?: T, readonly optional?: TOptional},
  env = process.env,
): TOptional extends false ? NonNullable<T> : (T extends undefined ? T : NonNullable<T>) {
  const rawValue = env[prop]
  if (!rawValue) {
    const defaultValue = opts?.defaultValue
    if (isNotNullOrUndefined(defaultValue)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return defaultValue as NonNullable<T>
    }

    if (opts?.optional) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return undefined
    }

    throw new Error(`Environment variable "${prop}" is required`)
  }
  try {
    return JSON.parse(rawValue)
  } catch (e) {
    throw new Error(`Failed to parse environment variable "${prop}", expected number got "${rawValue}"`)
  }
}

export function parseEnvBoolean<T extends boolean | undefined, TOptional extends boolean = false>(
  prop: string,
  opts?: { readonly defaultValue?: T, readonly optional?: TOptional},
  env = process.env,
): TOptional extends false ? boolean : (T extends boolean ? boolean : boolean | undefined) {
  const rawValue = env[prop]
  if (!rawValue) {
    const defaultValue = opts?.defaultValue
    if (isNotNullOrUndefined(defaultValue)) {
      return defaultValue as boolean
    }

    if (opts?.optional) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return undefined
    }

    throw new Error(`Environment variable "${prop}" is required`)
  }
  try {
    const value = JSON.parse(rawValue) as boolean

    if (typeof value !== 'boolean') {
      if (value === 1) {
        return true
      }
      if (value === 0) {
        return false
      }
      throw new Error(`Failed to parse environment variable "${prop}", expected boolean got "${rawValue}"`)
    }

    return value
  } catch (e) {
    throw new Error(`Failed to parse environment variable "${prop}", expected boolean got "${rawValue}"`)
  }
}
