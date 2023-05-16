type DataLoaderWithStringKey<T> = {
  readonly batchLoadFn: (keys: readonly string[]) => Promise<readonly T[]> | readonly T[],
  readonly cacheKeyFn?: undefined
}

type DataLoaderWithKeyFunction<T, TKey> = {
  readonly batchLoadFn: (keys: readonly TKey[]) => Promise<readonly T[]> | readonly T[],
  readonly cacheKeyFn: (key: TKey) => string
}

function createSuperDataLoader<T, TKey = string>({
  batchLoadFn,
  cacheKeyFn,
}: DataLoaderWithKeyFunction<T, TKey> | DataLoaderWithStringKey<T>) {
  const dataCache = new Map<string, T>()
  const keysToResolveOnNextTickSet = new Map<string, TKey>()
  let nextTickPromise: Promise<unknown> | undefined

  const prepareNextTick = async () => new Promise((resolve) => {
    process.nextTick(async () => {
      const keys = Array.from(keysToResolveOnNextTickSet.values())

      console.log(keys.length, 'keys.length')

      const results = await batchLoadFn(
        // @ts-expect-error this is already safe
        keys,
      )

      if (results.length !== keysToResolveOnNextTickSet.size) {
        throw new Error('batchLoadFn error: returned array length has to be the same length as the keys length')
      }

      const iter = keysToResolveOnNextTickSet.keys()
      // eslint-disable-next-line no-plusplus
      for (let index = 0; index < results.length; index++) {
        dataCache.set(
          iter.next().value!,
          results[index]!,
        )
      }

      keysToResolveOnNextTickSet.clear()
      resolve(undefined)
    })
  })

  const getKey = cacheKeyFn || ((key: TKey) => key as string)

  const loadMany = async (keys: readonly TKey[]) => Promise.all(keys.map(load))

  const load = async (key: TKey) => {
    const keyStr = getKey(key)

    const valueInCache = dataCache.get(keyStr)

    if (valueInCache) {
      return valueInCache
    }

    if (keysToResolveOnNextTickSet.size === 0) {
      nextTickPromise = prepareNextTick()
    }

    keysToResolveOnNextTickSet.set(keyStr, key)

    await nextTickPromise

    return dataCache.get(keyStr)
  }

  const clear = (key: TKey) => {
    const keyStr = getKey(key)
    dataCache.delete(keyStr)
  }

  const clearAll = () => {
    dataCache.clear()
  }

  const prime = (key: TKey, value: T) => {
    const keyStr = getKey(key)
    dataCache.set(keyStr, value)
  }

  return {
    load, loadMany, clear, clearAll, prime,
  }
}

export default createSuperDataLoader
