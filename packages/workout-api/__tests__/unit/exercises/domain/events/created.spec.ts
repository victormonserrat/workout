import { itIsNamed } from '@victormonserrat/name-type'

import CreatedExercise from '~/exercises/domain/events/created'

describe('CreatedExercise', () => {
  const __name__ = 'CreatedExercise'
  const id = 'id'
  const name = 'name'
  const createdExercise = CreatedExercise.with({ id, name })

  itIsNamed(createdExercise)

  it.concurrent('has an id', () => {
    expect(createdExercise).toHaveProperty('id')
  })

  it.concurrent('has a name', () => {
    expect(createdExercise).toHaveProperty('name')
  })

  it.concurrent('can be created', () => {
    expect(createdExercise.__name__).toBe(__name__)
    expect(createdExercise.id).toBe(id)
    expect(createdExercise.name).toBe(name)
  })
})
