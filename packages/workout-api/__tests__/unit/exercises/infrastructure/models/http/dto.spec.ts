import Exercise from '~/exercises/domain/models/exercise'
import ExerciseId from '~/exercises/domain/models/id'
import ExerciseName from '~/exercises/domain/models/name'
import ExerciseDto from '~/exercises/infrastructure/models/http/dto'

describe('ExerciseDto', () => {
  const idValue = '54e31582-ce36-4a6f-ba72-81d0ae728121'
  const id = ExerciseId.fromString(idValue).value as ExerciseId
  const nameValue = 'name'
  const name = ExerciseName.fromString(nameValue).value as ExerciseName
  const dto = ExerciseDto.fromExercise(Exercise.with({ id, name }))

  it.concurrent('has an id', () => {
    expect(dto).toHaveProperty('id')
  })

  it.concurrent('has a name', () => {
    expect(dto).toHaveProperty('name')
  })

  it.concurrent('can be created from exercise', () => {
    expect(dto.id).toBe(idValue)
    expect(dto.name).toBe(nameValue)
  })
})
