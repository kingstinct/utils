import { handleExtraFields, removeDeepFields } from './projectionFromGraphQLInfo'

import type { ObjectId } from 'mongodb'

type ResolverType = {
  readonly _id: string,
  readonly aResolverDependingOnSomething: string,
  readonly createdAt: string,
  readonly b: {
    readonly very: {
      readonly deep: {
        readonly property: string
      }
    }
  },
}

type DbType = {
  readonly _id: ObjectId,
  readonly importantToResolver: string;
  readonly a: {
    readonly very: {
      readonly deep: {
        readonly property: string
      }
    }
  },
  readonly createdAt: string
}

describe('projectionFromGraphQLInfo', () => {
  test('Should swallow granular projections when there is a more inclusive one', () => {
    const projection = removeDeepFields({ 'anotherProjection': 1, 'anotherProjection.heyyyy': 1, 'anotherProjection.swallowed': 1 })

    expect(projection).toEqual({ anotherProjection: 1 })
  })

  test('Should add extra fields when array is empty', () => {
    const projection = handleExtraFields<ResolverType, DbType>({ anotherProjection: 1 }, {
      importantToResolver: [],
    })

    expect(projection).toEqual({ anotherProjection: 1, importantToResolver: 1 })
  })

  test('Should not add extra fields if dependency is not requested', () => {
    const projection = handleExtraFields<ResolverType, DbType>({ anotherProjection: 1 }, {
      importantToResolver: ['createdAt'],
    })

    expect(projection).toEqual({ anotherProjection: 1 })
  })

  test('Should add extra fields if dependency is requested', () => {
    const projection = handleExtraFields<ResolverType, DbType>({ 'b.very.deep.property': 1 }, {
      'a.very.deep.property': ['b.very.deep.property'],
    })

    expect(projection).toEqual({ 'a.very.deep.property': 1, 'b.very.deep.property': 1 })
  })
})
