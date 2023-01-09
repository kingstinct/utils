import type { AbstractCursor } from 'mongodb'

export class AbortableTime {
  private readonly startedAt: number

  private readonly timeout: number

  constructor(timeout: number) {
    this.startedAt = Date.now()
    this.timeout = timeout
  }

  get abortSignal(): AbortSignal {
    return AbortSignal.timeout(this.timeLeftMS)
  }

  get timeLeftMS(): number {
    return Math.max(this.timeout - (Date.now() - this.startedAt), 0)
  }

  async executeWithTimeout<T>(cursor: AbstractCursor<T>): Promise<readonly T[]> {
    return this.timeLeftMS > 0 ? cursor.maxTimeMS(this.timeLeftMS).toArray() : []
  }
}

export default AbortableTime
