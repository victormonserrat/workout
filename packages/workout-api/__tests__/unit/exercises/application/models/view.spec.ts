import ExerciseView from '~/exercises/application/models/view'

describe('ExerciseView', () => {
  const __name__ = 'ExerciseView'
  const id = 'id'
  const name = 'name'
  const view = ExerciseView.with({ id, name })

  it.concurrent('has an id', () => {
    expect(view).toHaveProperty('id')
  })

  it.concurrent('has a name', () => {
    expect(view).toHaveProperty('name')
  })

  it.concurrent('can be created', () => {
    expect(view.__name__).toBe(__name__)
    expect(view.id).toBe(id)
    expect(view.name).toBe(name)
  })
})
