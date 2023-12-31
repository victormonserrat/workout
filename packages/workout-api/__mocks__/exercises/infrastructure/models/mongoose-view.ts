import { Model } from 'mongoose'

import MongooseExerciseView from '~/exercises/infrastructure/models/mongoose-view'

const MongooseExerciseViewMock = {
  mock: () =>
    ({
      create: jest.fn(),
      findOne: () => ({
        lean: () => ({
          exec: jest.fn(),
        }),
      }),
    } as unknown as Model<MongooseExerciseView>),
} as const

export default MongooseExerciseViewMock
