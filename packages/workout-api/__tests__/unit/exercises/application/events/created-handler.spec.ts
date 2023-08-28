import CreatedExerciseHandler from '~/exercises/application/events/created-handler'
import ExerciseView from '~/exercises/application/models/view'
import ExerciseViews from '~/exercises/application/services/views'
import CreatedExercise from '~/exercises/domain/events/created'
import ExerciseViewsMock from '~/mocks/exercises/application/services/views'

describe('CreatedExerciseHandler', () => {
  let views: ExerciseViews
  let createdHandler: CreatedExerciseHandler

  beforeEach(() => {
    views = ExerciseViewsMock.mock()
    createdHandler = new CreatedExerciseHandler(views)
  })

  it('creates an exercise view with created exercise', async () => {
    const id = 'id'
    const name = 'name'
    const viewsAdd = jest.spyOn(views, 'add')

    await createdHandler.handle(CreatedExercise.with({ id, name }))
    expect(viewsAdd).toHaveBeenCalledWith(ExerciseView.with({ id, name }))
  })
})
