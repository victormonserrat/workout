import Either, { Left } from '@victormonserrat/either'

import ExerciseView from '~/exercises/application/models/view'
import NotFoundExercise from '~/exercises/domain/exceptions/not-found'
import InMemoryExerciseViews from '~/exercises/infrastructure/services/in-memory-views'
import { itIsAnExerciseViewsService } from '~/test/exercises/closures/views'

describe('InMemoryExerciseViews', () => {
  let views: ExerciseView[] = []
  let inMemoryViews = InMemoryExerciseViews.withViews(views)
  const idValue = '54e31582-ce36-4a6f-ba72-81d0ae728121'
  const nameValue = 'name'
  const view = ExerciseView.with({ id: idValue, name: nameValue })

  beforeEach(() => {
    views = []
    inMemoryViews = InMemoryExerciseViews.withViews(views)
  })

  itIsAnExerciseViewsService(inMemoryViews)

  it('adds a view', async () => {
    const viewsPush = jest.spyOn(views, 'push')

    const response = await inMemoryViews.add(view)

    expect(viewsPush).toHaveBeenCalledWith(view)
    expect(response).toBe(view)
  })

  it('finds a view if exists with name', async () => {
    const viewsFind = jest.spyOn(views, 'find')

    viewsFind.mockReturnValue(view)

    const response = await inMemoryViews.withName(nameValue)

    expect(viewsFind).toHaveBeenCalled()
    expect(response).toStrictEqual(Either.right(view))
  })

  it('can not find a view if does not exist with name', async () => {
    const viewsFind = jest.spyOn(views, 'find')
    const notFound = NotFoundExercise.withName(nameValue)

    viewsFind.mockReturnValue(undefined)

    const response = (await inMemoryViews.withName(
      nameValue,
    )) as Left<NotFoundExercise>

    expect(viewsFind).toHaveBeenCalled()
    expect(Either.isRight(response)).toBe(false)
    expect(response.value.__name__).toBe(notFound.__name__)
    expect(response.value.code).toBe(notFound.code)
  })
})
