function logPrettyData<T = unknown>(data: T, title?: string): T {
  const titleStr = title ? `${title}: ` : ''
  console.log(`${titleStr}${JSON.stringify(data, null, 2)}`)
  return data
}

export default logPrettyData
