import { jsonEvent, NO_STREAM } from '@eventstore/db-client'

import CreatedExercise from '~/exercises/domain/events/created'
import Exercise from '~/exercises/domain/models/exercise'
import ExerciseId from '~/exercises/domain/models/id'
import ExerciseName from '~/exercises/domain/models/name'
import EventStoreExercises from '~/exercises/infrastructure/services/event-store-exercises'
import EventStoreDBClientMock from '~/mocks/@eventstore/db-client/event-store-db-client'
import { itIsAnExercisesService } from '~/test/exercises/closures/exercises'

describe('EventStoreExercises', () => {
  let client = EventStoreDBClientMock.mock()
  let exercises = new EventStoreExercises(client)
  const idValue = '54e31582-ce36-4a6f-ba72-81d0ae728121'
  const id = ExerciseId.fromString(idValue).value as ExerciseId
  const nameValue = 'name'
  const name = ExerciseName.fromString(nameValue).value as ExerciseName
  const exercise = Exercise.with({ id, name })

  beforeEach(() => {
    client = EventStoreDBClientMock.mock()
    exercises = new EventStoreExercises(client)
  })

  itIsAnExercisesService(exercises)

  it('adds an exercise', async () => {
    const clientAppendToStream = jest.spyOn(client, 'appendToStream')

    clientAppendToStream.mockResolvedValue({
      nextExpectedRevision: BigInt(1),
      success: true,
    })

    const response = await exercises.add(exercise)

    expect(clientAppendToStream).toHaveBeenCalledWith(
      `${Exercise.__name__}-${exercise.id.value}`,
      jsonEvent({
        data: {
          id: exercise.id.value,
          name: exercise.name.value,
        },
        id: expect.anything(),
        type: CreatedExercise.name,
      }),
      { expectedRevision: NO_STREAM },
    )
    expect(response).toBe(exercise)
  })
})
