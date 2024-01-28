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
    throw new Error(`Failed to parse environment variable "${prop}", expected JSON got "${rawValue}"`)
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

type EnumOrArrayOfLiterals<T extends string> = ArrayLike<T> | { readonly [s: string]: T; }

export function parseEnvEnum<
  T extends string,
  TOptional extends boolean = false,
  TOpts extends { readonly defaultValue?: TOptional extends false ? NonNullable<T> : T | undefined, readonly optional?: TOptional} = { readonly defaultValue?: TOptional extends false ? NonNullable<T> : T | undefined, readonly optional?: TOptional}
>(
  prop: string,
  validValues: EnumOrArrayOfLiterals<T>,
  opts?: TOptional extends false ? Required<TOpts> : TOpts,
  env = process.env,
): TOptional extends false ? NonNullable<T> : T | undefined {
  const rawValue = env[prop]

  const enumOrArray = Object.values(validValues)
  // @ts-expect-error this is contained
  const isPartOfEnumOrArray = rawValue ? enumOrArray.includes(rawValue) : false

  if (isPartOfEnumOrArray) {
    return rawValue as NonNullable<T>
  }

  const defaultValue = opts?.defaultValue
  if (isNotNullOrUndefined(defaultValue) && enumOrArray.includes(defaultValue)) {
    return defaultValue
  }

  if (opts?.optional) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return undefined
  }

  const error = rawValue
    ? new Error(`Environment variable "${prop}" was "${rawValue}", should be one of [${enumOrArray.join(', ')}]`)
    : new Error(`Environment variable "${prop}" is required`)

  throw error
}
