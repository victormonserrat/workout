import ExerciseViews from '~/exercises/application/services/views'

const ExerciseViewsMock = {
  mock: () =>
    ({
      add: jest.fn(),
      withName: jest.fn(),
    } as unknown as ExerciseViews),
} as const

export default ExerciseViewsMock
