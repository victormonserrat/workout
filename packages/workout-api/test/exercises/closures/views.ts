import ExerciseViews from '~/exercises/application/services/views'

export const itIsAnExerciseViewsService = (value: ExerciseViews) => {
  it.concurrent('is an exercise views service', () => {
    expect(value).toHaveProperty('add')
    expect(value).toHaveProperty('withName')
  })
}
