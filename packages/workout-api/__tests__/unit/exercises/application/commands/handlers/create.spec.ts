import { EventBus } from '@nestjs/cqrs'
import {
  AggregateRoot,
  expectCanNotHaveInvalidFormat,
  InvalidUuid,
} from '@victormonserrat/ddd'
import Either, { Left } from '@victormonserrat/either'

import CreateExercise from '~/exercises/application/commands/create'
import CreateExerciseHandler from '~/exercises/application/commands/handlers/create'
import NotCreatedExercise from '~/exercises/application/exceptions/not-created'
import ExerciseView from '~/exercises/application/models/view'
import ExerciseViews from '~/exercises/application/services/views'
import InvalidExerciseName from '~/exercises/domain/exceptions/invalid-name'
import NotFoundExercise from '~/exercises/domain/exceptions/not-found'
import Exercise from '~/exercises/domain/models/exercise'
import ExerciseId from '~/exercises/domain/models/id'
import ExerciseName from '~/exercises/domain/models/name'
import Exercises from '~/exercises/domain/services/exercises'
import EventBusMock from '~/mocks/@nestjs/cqrs/event-bus'
import ExerciseViewsMock from '~/mocks/exercises/application/services/views'
import ExercisesMock from '~/mocks/exercises/domain/services/exercises'
import { expectCanNotBeBlank } from '~/test/exercises/closures/name'

describe('CreateExerciseHandler', () => {
  let events: EventBus
  let exercises: Exercises
  let views: ExerciseViews
  let createHandler: CreateExerciseHandler
  const idValue = '54e31582-ce36-4a6f-ba72-81d0ae728121'
  const id = ExerciseId.fromString(idValue).value as ExerciseId
  const nameValue = 'name'
  const name = ExerciseName.fromString(nameValue).value as ExerciseName
  const exercise = Exercise.with({ id, name })

  beforeEach(() => {
    events = EventBusMock.mock()
    exercises = ExercisesMock.mock()
    views = ExerciseViewsMock.mock()
    createHandler = new CreateExerciseHandler(events, exercises, views)
  })

  it('creates an exercise', async () => {
    const eventsPublishAll = jest.spyOn(events, 'publishAll')
    const exercisesAdd = jest.spyOn(exercises, 'add')
    const viewsWithName = jest.spyOn(views, 'withName')

    viewsWithName.mockResolvedValue(
      Either.left(NotFoundExercise.withName(nameValue)),
    )

    const response = await createHandler.execute(
      CreateExercise.with({ id: idValue, name: nameValue }),
    )
    const commited = AggregateRoot.commit(exercise)

    expect(viewsWithName).toHaveBeenCalledWith(nameValue)
    expect(exercisesAdd).toHaveBeenCalledWith(exercise)
    expect(eventsPublishAll).toHaveBeenCalledWith(exercise.__events__)
    expect(response).toStrictEqual(Either.right(commited))
  })

  it.each([
    {
      invalidId: ' ',
      invalidName: ' ',
    },
    {
      invalidId: ' ',
      invalidName: undefined,
    },
    {
      invalidId: undefined,
      invalidName: ' ',
    },
  ])(
    'can not create an invalid exercise',
    async ({ invalidId, invalidName }) => {
      const eventsPublishAll = jest.spyOn(events, 'publishAll')
      const exercisesAdd = jest.spyOn(exercises, 'add')
      const viewsWithName = jest.spyOn(views, 'withName')

      viewsWithName.mockResolvedValue(
        Either.left(NotFoundExercise.withName(nameValue)),
      )

      const response = (await createHandler.execute(
        CreateExercise.with({
          id: invalidId ?? idValue,
          name: invalidName ?? nameValue,
        }),
      )) as Left<(InvalidUuid | InvalidExerciseName)[]>

      if (invalidName) expect(viewsWithName).not.toHaveBeenCalled()
      else expect(viewsWithName).toHaveBeenCalledWith(nameValue)
      expect(exercisesAdd).not.toHaveBeenCalled()
      expect(eventsPublishAll).not.toHaveBeenCalled()
      expect(Either.isRight(response)).toBe(false)
      if (invalidId)
        expectCanNotHaveInvalidFormat(
          Either.left(response.value[0] as InvalidUuid),
        )
      if (invalidName)
        expectCanNotBeBlank(
          Either.left(response.value[invalidId ? 1 : 0] as InvalidExerciseName),
        )
    },
  )

  it.each([{ invalidId: ' ' }, { invalidId: undefined }])(
    'can not create an exercise with an already in use name',
    async ({ invalidId }) => {
      const eventsPublishAll = jest.spyOn(events, 'publishAll')
      const exercisesAdd = jest.spyOn(exercises, 'add')
      const viewsWithName = jest.spyOn(views, 'withName')
      const notCreated =
        NotCreatedExercise.causeAlreadyExistsOneWithName(nameValue)

      viewsWithName.mockResolvedValue(
        Either.right(ExerciseView.with({ id: idValue, name: nameValue })),
      )

      const response = (await createHandler.execute(
        CreateExercise.with({ id: invalidId ?? idValue, name: nameValue }),
      )) as Left<(InvalidUuid | NotCreatedExercise)[]>

      expect(viewsWithName).toHaveBeenCalledWith(nameValue)
      expect(exercisesAdd).not.toHaveBeenCalled()
      expect(eventsPublishAll).not.toHaveBeenCalled()
      expect(Either.isRight(response)).toBe(false)
      if (invalidId)
        expectCanNotHaveInvalidFormat(
          Either.left(response.value[0] as InvalidUuid),
        )
      expect(response.value[invalidId ? 1 : 0].__name__).toBe(
        notCreated.__name__,
      )
      expect(response.value[invalidId ? 1 : 0].code).toBe(notCreated.code)
    },
  )
})
