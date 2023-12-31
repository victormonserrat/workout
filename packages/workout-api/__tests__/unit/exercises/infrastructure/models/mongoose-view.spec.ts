import ExerciseView from '~/exercises/application/models/view'
import MongooseExerciseView from '~/exercises/infrastructure/models/mongoose-view'

describe('MongooseExerciseView', () => {
  const id = 'id'
  const name = 'name'
  const view = ExerciseView.with({ id, name })
  const mongooseView = MongooseExerciseView.fromExerciseView(view)

  it.concurrent('has an id', () => {
    expect(mongooseView).toHaveProperty('_id')
  })

  it.concurrent('has a name', () => {
    expect(mongooseView).toHaveProperty('name')
  })

  it.concurrent('can be created from view', () => {
    expect(mongooseView._id).toBe(id)
    expect(mongooseView.name).toBe(name)
  })

  it.concurrent('can be converted to view', () => {
    const convertedView = MongooseExerciseView.toExerciseView(mongooseView)

    expect(convertedView.id).toBe(id)
    expect(convertedView.name).toBe(name)
  })
})
