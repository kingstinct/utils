import dayjs from 'dayjs'
import tz from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { GraphQLScalarType } from 'graphql'
import { GraphQLError } from 'graphql/error'
import { Kind } from 'graphql/language'

dayjs.extend(tz)
dayjs.extend(utc)

function isValidYYYYMMDD(date: string) {
  const expression = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/
  return expression.test(date)
}

export function isValidDayjs(date: string) {
  return dayjs(date).isValid()
}

const REGEX_TIMEZONE_OFFSET_FORMAT = /^.*([+-]\d{2}:?\d{2}|[+-]\d{2}|Z)$/

export const getDayjsWithOffset = (date: string) => {
  const rawDate = dayjs(date)

  const timezoneInfo = date.match(REGEX_TIMEZONE_OFFSET_FORMAT)

  if (timezoneInfo) {
    const [, offset] = timezoneInfo

    if (offset === 'Z') {
      return rawDate.utc() // use UTC timezone
    }

    if (offset) {
      return rawDate.utcOffset(offset, false) // keep timestamp identity, but change timezone
    }
  }

  return rawDate.tz() // use dayjs default timezone (local by default)
}

export const UniversalDateTime = new GraphQLScalarType({
  name: 'UniversalDateTime',
  description: 'UniversalDateTime accepts a YYYY-MM-DD or iso8601 string timestamp, only validation, returns same format as input',

  // @ts-expect-error hard to get this 100% internally
  // from database towards client
  serialize(value: dayjs.Dayjs | string) {
    if (typeof value === 'string') {
      if (!isValidYYYYMMDD(value)) {
        throw new GraphQLError('serialize: invalid string format, require YYYY-MM-DD')
      }
      return value
    }

    if (!value.isValid || !value.isValid()) {
      throw new GraphQLError('serialize: require db object to be of type Dayjs')
    }

    if (value.millisecond() !== 0) {
      if (value.isUTC()) {
        return value.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
      }
      return value.format('YYYY-MM-DDTHH:mm:ss.SSSZ')
    }

    return value.format()
  },

  // @ts-expect-error hard to get this 100% internally
  // Read client input where the value is JSON.
  parseValue(value: string) {
    if (typeof value === 'string' && isValidYYYYMMDD(value)) {
      return value
    } if (isValidDayjs(value)) {
      // const iso8601String: string = value as string;
      // date = dayjs(iso8601String).toDate();
      return getDayjsWithOffset(value)
    }
    throw new GraphQLError(`Require string on format YYYY-MM-DD or iso8601/dayjs valid string, found: ${value}`)
  },

  // AST from client towards database
  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING && ast.kind !== Kind.INT) {
      throw new GraphQLError(`Require string on format YYYY-MM-DD or iso8601/dayjs valid string, found: ${ast.kind}`, [ast])
    }

    if (typeof ast.value === 'string' && isValidYYYYMMDD(ast.value)) {
      return ast.value
    } if (isValidDayjs(ast.value)) {
      return ast.value
    }
    throw new GraphQLError(`Require string on format YYYY-MM-DD or iso8601/dayjs valid string, found: ${ast.value}`)
  },
})

export default UniversalDateTime
