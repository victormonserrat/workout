import { itIsAnException } from '@victormonserrat/ddd'

import NotCreatedExercise from '~/exercises/application/exceptions/not-created'

describe('NotCreatedExercise', () => {
  const __name__ = 'NotCreatedExercise'
  const name = 'name'
  const notCreated = NotCreatedExercise.causeAlreadyExistsOneWithName(name)

  itIsAnException(notCreated)

  it.concurrent('can be cause already exists one with name', () => {
    expect(notCreated.__name__).toBe(__name__)
    expect(notCreated.code).toBe('used_name')
    expect(notCreated.message).toBe(`Exercise name ${name} is already in use`)
  })
})
