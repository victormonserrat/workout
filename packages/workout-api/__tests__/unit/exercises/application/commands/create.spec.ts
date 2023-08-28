import { itIsNamed } from '@victormonserrat/name-type'

import CreateExercise from '~/exercises/application/commands/create'

describe('CreateExercise', () => {
  const __name__ = 'CreateExercise'
  const id = 'id'
  const name = 'name'
  const createExercise = CreateExercise.with({ id, name })

  itIsNamed(createExercise)

  it.concurrent('has an id', () => {
    expect(createExercise).toHaveProperty('id')
  })

  it.concurrent('has a name', () => {
    expect(createExercise).toHaveProperty('name')
  })

  it.concurrent('can be created', () => {
    expect(createExercise.__name__).toBe(__name__)
    expect(createExercise.id).toBe(id)
    expect(createExercise.name).toBe(name)
  })
})
