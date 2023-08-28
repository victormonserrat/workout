import { itIsAnAggregateRoot } from '@victormonserrat/ddd'

import CreatedExercise from '~/exercises/domain/events/created'
import Exercise from '~/exercises/domain/models/exercise'
import ExerciseId from '~/exercises/domain/models/id'
import ExerciseName from '~/exercises/domain/models/name'

describe('Exercise', () => {
  const __name__ = 'Exercise'
  const idValue = '54e31582-ce36-4a6f-ba72-81d0ae728121'
  const id = ExerciseId.fromString(idValue).value as ExerciseId
  const nameValue = 'name'
  const name = ExerciseName.fromString(nameValue).value as ExerciseName
  const exercise = Exercise.with({ id, name })

  itIsAnAggregateRoot(exercise)

  it.concurrent('has a name', () => {
    expect(exercise).toHaveProperty('name')
  })

  it.concurrent('can be created', () => {
    expect(exercise.__name__).toBe(__name__)
    expect(exercise.id).toBe(id)
    expect(exercise.name).toBe(name)
    expect(exercise.__events__).toStrictEqual([
      CreatedExercise.with({ id: idValue, name: nameValue }),
    ])
  })
})
