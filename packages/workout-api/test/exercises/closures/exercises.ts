import Exercises from '~/exercises/domain/services/exercises'

export const itIsAnExercisesService = (value: Exercises) => {
  it('is an exercises service', () => {
    expect(value).toHaveProperty('add')
  })
}
