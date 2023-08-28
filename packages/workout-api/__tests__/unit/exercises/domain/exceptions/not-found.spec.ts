import { itIsAnException } from '@victormonserrat/ddd'

import NotFoundExercise from '~/exercises/domain/exceptions/not-found'

describe('NotFoundExercise', () => {
  const __name__ = 'NotFoundExercise'
  const name = 'name'
  const notFound = NotFoundExercise.withName(name)

  itIsAnException(notFound)

  it.concurrent('can be created with name', () => {
    expect(notFound.__name__).toBe(__name__)
    expect(notFound.code).toBe('not_found')
    expect(notFound.message).toBe(`Exercise with name ${name} can not be found`)
  })
})
