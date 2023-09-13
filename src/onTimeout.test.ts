import onTimeout from './onTimeout'

describe('onTimeout', () => {
  test('Should execute after timeout', async () => {
    jest.useFakeTimers()

    const cb = jest.fn()
    onTimeout(1000, cb)

    await jest.runAllTimersAsync()

    expect(cb).toHaveBeenCalledTimes(1)
  })

  test('Should cancel timeout', () => {
    jest.useFakeTimers()

    const cb = jest.fn()
    const cancel = onTimeout(1000, cb)
    cancel()

    jest.runAllTimers()

    expect(cb).toHaveBeenCalledTimes(0)
  })
})
