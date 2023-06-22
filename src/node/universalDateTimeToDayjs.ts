import dayjs from 'dayjs'

import type { Dayjs } from 'dayjs'

// const dateToInterpreted = (date: Date | string, endOfDay = false) => {
//   if (typeof date === 'string') {
//     return dateStringOrTimestampToDayjs(date, endOfDay).toDate()
//   }
//   return date
// }

// export const dateStringOrTimestampToDayjs = (date: Date | string, endOfDay = false) => {
//   if (typeof date === 'string') {
//     const utcTime = dayjs(date).utc(true)
//     const startOrEndOfDay = endOfDay ? utcTime.endOf('day') : utcTime.startOf('day')
//     return startOrEndOfDay
//   }
//   return dayjs(date)
// }

type UniversalDateTimeInterpretation = 'endOfDay' | 'startOfDay'

export const universalDateTimeToDayjs = (
  universalDateTime: Dayjs | string,
  interpretDate: UniversalDateTimeInterpretation = 'startOfDay',
) => {
  if (typeof universalDateTime === 'string') {
    const dayInDefaultTimezone = dayjs(universalDateTime).tz()
    const startOrEndOfDay = interpretDate === 'endOfDay'
      ? dayInDefaultTimezone.endOf('day')
      : dayInDefaultTimezone.startOf('day')

    return startOrEndOfDay
  }
  return universalDateTime
}

export const universalDateTimeToDate = (
  universalDateTime: Dayjs | string,
  interpretDate: UniversalDateTimeInterpretation = 'startOfDay',
) => universalDateTimeToDayjs(universalDateTime, interpretDate).toDate()

export default universalDateTimeToDayjs
