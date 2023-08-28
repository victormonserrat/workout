import Exercise from '~/exercises/domain/models/exercise'
import ExerciseId from '~/exercises/domain/models/id'
import ExerciseName from '~/exercises/domain/models/name'
import InMemoryExercises from '~/exercises/infrastructure/services/in-memory-exercises'
import { itIsAnExercisesService } from '~/test/exercises/closures/exercises'

describe('InMemoryExercises', () => {
  let exercises: Exercise[] = []
  let inMemoryExercises = InMemoryExercises.withExercises(exercises)
  const idValue = '54e31582-ce36-4a6f-ba72-81d0ae728121'
  const id = ExerciseId.fromString(idValue).value as ExerciseId
  const nameValue = 'name'
  const name = ExerciseName.fromString(nameValue).value as ExerciseName
  const exercise = Exercise.with({ id, name })

  beforeEach(() => {
    exercises = []
    inMemoryExercises = InMemoryExercises.withExercises(exercises)
  })

  itIsAnExercisesService(inMemoryExercises)

  it('adds an exercise', async () => {
    const exercisesPush = jest.spyOn(exercises, 'push')

    const response = await inMemoryExercises.add(exercise)

    expect(exercisesPush).toHaveBeenCalledWith(exercise)
    expect(response).toBe(exercise)
  })
})
