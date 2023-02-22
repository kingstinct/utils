import debouncedAggregate from './debouncedAggregate'

describe('debouncedAggregate', () => {
  beforeEach(() => {

  })

  it('Should work', () => {
    jest.useFakeTimers()
    const callback = jest.fn()
    const debouncer = debouncedAggregate(100, callback)

    debouncer(1)
    debouncer(2)
    debouncer(3)

    jest.runAllTimers()

    expect(callback).toHaveBeenCalledWith([1, 2, 3])

    jest.useRealTimers()
  })

  it('Should work with maxItems', () => {
    jest.useFakeTimers()
    const callback = jest.fn()
    const debouncer = debouncedAggregate(100, callback, { maxItems: 2 })

    debouncer(1)
    debouncer(2)
    debouncer(3)

    jest.runAllTimers()

    expect(callback).toHaveBeenCalledWith([1, 2])
    expect(callback).toHaveBeenCalledWith([3])

    jest.useRealTimers()
  })

  it('Should work with maxMs', async () => {
    const callback = jest.fn()
    const debouncer = debouncedAggregate(200, callback, { maxMs: 275 })

    debouncer(1)

    await new Promise((resolve) => { setTimeout(resolve, 100) })

    debouncer(2)

    await new Promise((resolve) => { setTimeout(resolve, 100) })

    debouncer(3) // should be called

    await new Promise((resolve) => { setTimeout(resolve, 100) })

    expect(callback).toHaveBeenCalledWith([1, 2, 3])

    jest.useFakeTimers()

    debouncer(4)

    jest.runAllTimers()

    expect(callback).toHaveBeenCalledWith([4])
    expect(callback).toHaveBeenCalledTimes(2)

    jest.useRealTimers()
  })
})
