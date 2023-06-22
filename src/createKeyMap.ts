export function createKeyMap<T>(items: readonly T[], idKeyOrFn: keyof T | ((item: T) => number | string | symbol)) {
  // @ts-expect-error - Could be explored further
  return new Map(items.map((item) => [idKeyOrFn instanceof Function ? idKeyOrFn(item) : item[idKeyOrFn], item]))
}

export default createKeyMap
