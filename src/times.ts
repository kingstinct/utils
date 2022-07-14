function times<T = unknown>(length: number, cb: (index: number) => T): T[] {
  return Array.from({ length }, (_, index) => cb(index))
}

export default times
