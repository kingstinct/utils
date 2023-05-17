import DataLoader from 'dataloader'

import createSuperDataLoader from './SuperDataLoader'
import times from '../times'
import wait from '../wait'

describe('SuperDataLoader', () => {
  it('should be called multiple times', async () => {
    const batchLoadFn = jest.fn((keys) => keys)
    const loader = createSuperDataLoader({ batchLoadFn })

    const promise1 = await loader.load('key1')
    const promise2 = await loader.load('key2')
    const promise3 = await loader.load('key3')

    expect(promise1).toBe('key1')
    expect(promise2).toBe('key2')
    expect(promise3).toBe('key3')

    expect(batchLoadFn).toHaveBeenCalledTimes(3)
  })

  it('should be called one time', async () => {
    const batchLoadFn = jest.fn((keys) => keys)
    const loader = createSuperDataLoader({ batchLoadFn })

    const [promise1, promise2, promise3] = await Promise.all([
      loader.load('key1'),
      loader.load('key2'),
      loader.load('key3'),
    ])

    expect(promise1).toBe('key1')
    expect(promise2).toBe('key2')
    expect(promise3).toBe('key3')

    expect(batchLoadFn).toHaveBeenCalledTimes(1)
  })

  it('should be called one time even', async () => {
    const batchLoadFn = jest.fn((keys) => keys)
    const loader = createSuperDataLoader({ batchLoadFn })

    await Promise.all([
      loader.load('key1'),
      loader.load('key2'),
      loader.load('key3'),
    ])

    const [promise1, promise2, promise3] = await Promise.all([
      loader.load('key1'),
      loader.load('key2'),
      loader.load('key3'),
    ])

    expect(promise1).toBe('key1')
    expect(promise2).toBe('key2')
    expect(promise3).toBe('key3')

    expect(batchLoadFn).toHaveBeenCalledTimes(1)
  })

  it('Should be faster than normal dataloader with loadMany with different keys', async () => {
    const hello = times(1000000, (i) => `hello${i}`)
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const batchLoadFn = (keys: readonly string[]) => keys
    const loader = createSuperDataLoader({ batchLoadFn })

    const original = new DataLoader(async (keys: readonly string[]) => Promise.resolve(batchLoadFn(keys)))

    await wait(50)

    const start2 = performance.now()
    await loader.loadMany(hello)
    const end2 = performance.now()
    const superDataLoaderTime = end2 - start2

    await wait(50)

    const start = performance.now()
    await original.loadMany(hello)
    const end = performance.now()
    const dataloaderTime = end - start

    console.log(`[different keys]:\n[SuperDataLoader]: ${superDataLoaderTime}\n[DataLoader]: ${dataloaderTime}\n${dataloaderTime / superDataLoaderTime}x) faster}`)

    expect(superDataLoaderTime).toBeLessThanOrEqual(dataloaderTime)
  })

  it('Should be faster than normal dataloader with loadMany with different keys (async)', async () => {
    const hello = times(1000000, (i) => `hello${i}`)
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const batchLoadFn = async (keys: readonly string[]) => {
      await wait(10)
      return keys
    }
    const loader = createSuperDataLoader({
      batchLoadFn,
    })

    const original = new DataLoader(batchLoadFn)

    await wait(50)

    const start2 = performance.now()
    await loader.loadMany(hello)
    const end2 = performance.now()
    const superDataLoaderTime = end2 - start2

    await wait(50)

    const start = performance.now()
    await original.loadMany(hello)
    const end = performance.now()
    const dataloaderTime = end - start

    console.log(`[different keys (async)]:\n[SuperDataLoader]: ${superDataLoaderTime}\n[DataLoader]: ${dataloaderTime}\n${dataloaderTime / superDataLoaderTime}x) faster}`)

    expect(superDataLoaderTime).toBeLessThanOrEqual(dataloaderTime)
  })

  it('Should be faster than normal dataloader with loadMany with different keys - warm cache', async () => {
    const hello = times(1000000, (i) => `hello${i}`)
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const batchLoadFn = (keys: readonly string[]) => keys
    const loader = createSuperDataLoader({ batchLoadFn })
    await loader.loadMany(hello)

    const original = new DataLoader(async (keys: readonly string[]) => Promise.resolve(batchLoadFn(keys)))

    await original.loadMany(hello)

    await wait(50)

    const start2 = performance.now()
    await loader.loadMany(hello)
    const end2 = performance.now()
    const superDataLoaderTime = end2 - start2

    await wait(50)

    const start = performance.now()
    await original.loadMany(hello)
    const end = performance.now()
    const dataloaderTime = end - start

    console.log(`[different keys - warm cache]:\n[SuperDataLoader]: ${superDataLoaderTime}\n[DataLoader]: ${dataloaderTime}\n${dataloaderTime / superDataLoaderTime}x) faster}`)

    expect(superDataLoaderTime).toBeLessThanOrEqual(dataloaderTime)
  })

  it('Should be faster than normal dataloader with loadMany with different keys (async) - warm cache', async () => {
    const hello = times(1000000, (i) => `hello${i}`)
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const batchLoadFn = async (keys: readonly string[]) => {
      await wait(10)
      return keys
    }
    const loader = createSuperDataLoader({
      batchLoadFn,
    })

    await loader.loadMany(hello)

    const original = new DataLoader(batchLoadFn)

    await original.loadMany(hello)

    await wait(50)

    const start2 = performance.now()
    await loader.loadMany(hello)
    const end2 = performance.now()
    const superDataLoaderTime = end2 - start2

    await wait(50)

    const start = performance.now()
    await original.loadMany(hello)
    const end = performance.now()
    const dataloaderTime = end - start

    console.log(`[different keys - warm cache (async)]:\n[SuperDataLoader]: ${superDataLoaderTime}\n[DataLoader]: ${dataloaderTime}\n${dataloaderTime / superDataLoaderTime}x) faster}`)

    expect(superDataLoaderTime).toBeLessThanOrEqual(dataloaderTime)
  })

  it('Should be faster than normal dataloader with loadMany with same keys', async () => {
    const hello = times(1000000, () => `hello`)
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const batchLoadFn = (keys: readonly string[]) => keys
    const loader = createSuperDataLoader({ batchLoadFn })

    const original = new DataLoader(async (keys: readonly string[]) => Promise.resolve(batchLoadFn(keys)))

    await wait(50)

    const start2 = performance.now()
    await loader.loadMany(hello)
    const end2 = performance.now()
    const superDataLoaderTime = end2 - start2

    await wait(50)

    const start = performance.now()
    await original.loadMany(hello)
    const end = performance.now()
    const dataloaderTime = end - start

    console.log(`[same keys]:\n[SuperDataLoader]: ${superDataLoaderTime}\n[DataLoader]: ${dataloaderTime}\n${dataloaderTime / superDataLoaderTime}x) faster}`)

    expect(superDataLoaderTime).toBeLessThanOrEqual(dataloaderTime)
  })

  it('Should be faster than normal dataloader with loadMany with same keys (async)', async () => {
    const hello = times(1000000, () => `hello`)
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const batchLoadFn = async (keys: readonly string[]) => {
      await wait(10)
      return keys
    }
    const loader = createSuperDataLoader({
      batchLoadFn,
    })

    const original = new DataLoader(batchLoadFn)

    await wait(50)

    const start2 = performance.now()
    await loader.loadMany(hello)
    const end2 = performance.now()
    const superDataLoaderTime = end2 - start2

    await wait(50)

    const start = performance.now()
    await original.loadMany(hello)
    const end = performance.now()
    const dataloaderTime = end - start

    console.log(`[same keys (async)]:\n[SuperDataLoader]: ${superDataLoaderTime}\n[DataLoader]: ${dataloaderTime}\n${dataloaderTime / superDataLoaderTime}x) faster}`)

    expect(superDataLoaderTime).toBeLessThanOrEqual(dataloaderTime)
  })
})
