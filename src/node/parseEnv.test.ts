import {
  parseEnvBoolean, parseEnvEnum, parseEnvJSON, parseEnvNumber,
} from './parseEnv'

test('parseEnvBoolean', () => {
  const result = parseEnvBoolean('isSomething', { }, { isSomething: 'true' })

  expect(result).toEqual(true)
})

test('parseEnvEnum', () => {
  const result = parseEnvEnum('isSomething', ['value1', 'value2'], { }, { isSomething: 'value1' })

  expect(result).toEqual('value1')
})

test('parseEnvEnum when not in range', () => {
  let error
  try {
    parseEnvEnum('isSomething', ['value1', 'value2'], { }, { isSomething: 'value3' })
  } catch (e) {
    error = e
  }
  expect(error).toBeDefined()
  expect(error).toHaveProperty('message', 'Environment variable "isSomething" was "value3", should be one of [value1, value2]')
})

test('parseEnvEnum should use default value when not in range', () => {
  const result = parseEnvEnum(
    'isSomething',
    ['value1', 'value2'],
    { defaultValue: 'value1' },
    { isSomething: 'value3' },
  )

  expect(result).toEqual('value1')
})

test('parseEnvNumber', () => {
  const result = parseEnvNumber('aNumber', { }, { aNumber: '3' })

  expect(result).toEqual(3)
})

test('parseEnvJSON', () => {
  const result = parseEnvJSON('isSomething', { }, { isSomething: '{ "something": "cool" }' })

  expect(result).toEqual({ something: 'cool' })
})
