import Either, { Left } from '@victormonserrat/either'
import { Query } from 'mongoose'

import ExerciseView from '~/exercises/application/models/view'
import NotFoundExercise from '~/exercises/domain/exceptions/not-found'
import MongooseExerciseView from '~/exercises/infrastructure/models/mongoose-view'
import MongooseExerciseViews from '~/exercises/infrastructure/services/mongoose-views'
import MongooseExerciseViewMock from '~/mocks/exercises/infrastructure/models/mongoose-view'
import { itIsAnExerciseViewsService } from '~/test/exercises/closures/views'

describe('MongooseExerciseViews', () => {
  let views = MongooseExerciseViewMock.mock()
  let mongooseViews = new MongooseExerciseViews(views)
  const idValue = '54e31582-ce36-4a6f-ba72-81d0ae728121'
  const nameValue = 'name'
  const view = ExerciseView.with({ id: idValue, name: nameValue })

  beforeEach(() => {
    views = MongooseExerciseViewMock.mock()
    mongooseViews = new MongooseExerciseViews(views)
  })

  itIsAnExerciseViewsService(mongooseViews)

  it('adds a view', async () => {
    const viewsCreate = jest.spyOn(views, 'create')

    const response = await mongooseViews.add(view)

    expect(viewsCreate).toHaveBeenCalledWith(
      MongooseExerciseView.fromExerciseView(view),
    )
    expect(response).toBe(view)
  })

  it('finds a view if exists with name', async () => {
    const viewsFindOne = jest.spyOn(views, 'findOne')
    const mongooseView = MongooseExerciseView.fromExerciseView(view)

    viewsFindOne.mockReturnValue({
      lean: () => ({
        exec: async () => mongooseView,
      }),
    } as Query<unknown, unknown>)

    const response = await mongooseViews.withName(nameValue)

    expect(viewsFindOne).toHaveBeenCalledWith({ name: nameValue })
    expect(response).toStrictEqual(
      Either.right(MongooseExerciseView.toExerciseView(mongooseView)),
    )
  })

  it('can not find a view if does not exist with name', async () => {
    const viewsFindOne = jest.spyOn(views, 'findOne')
    const notFound = NotFoundExercise.withName(nameValue)

    viewsFindOne.mockReturnValue({
      lean: () => ({ exec: async () => null }),
    } as Query<unknown, unknown>)

    const response = (await mongooseViews.withName(
      nameValue,
    )) as Left<NotFoundExercise>

    expect(viewsFindOne).toHaveBeenCalledWith({ name: nameValue })
    expect(Either.isRight(response)).toBe(false)
    expect(response.value.__name__).toBe(notFound.__name__)
    expect(response.value.code).toBe(notFound.code)
  })
})
