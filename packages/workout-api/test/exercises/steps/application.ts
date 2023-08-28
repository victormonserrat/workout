import { DataTable, When } from '@cucumber/cucumber'
import { CommandBus, CqrsModule } from '@nestjs/cqrs'
import { Test } from '@nestjs/testing'
import Either from '@victormonserrat/either'
import Uuid from '@victormonserrat/uuid'

import CreateExercise from '~/exercises/application/commands/create'
import CreateExerciseHandler from '~/exercises/application/commands/handlers/create'
import CreatedExerciseHandler from '~/exercises/application/events/created-handler'
import NotCreatedExercise from '~/exercises/application/exceptions/not-created'
import ExerciseViews from '~/exercises/application/services/views'
import InvalidExerciseName from '~/exercises/domain/exceptions/invalid-name'
import Exercise from '~/exercises/domain/models/exercise'
import Exercises from '~/exercises/domain/services/exercises'

import { Context } from './common'

When(
  /^I create the following exercises?:$/,
  async function (this: Context, dataTable: DataTable) {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        CreateExerciseHandler,
        CreatedExerciseHandler,
        {
          provide: Exercises,
          useValue: this.exercises,
        },
        {
          provide: ExerciseViews,
          useValue: this.views,
        },
      ],
    }).compile()
    const commandBus = module.get(CommandBus)

    await module.createNestApplication().init()

    for (const { name } of dataTable.hashes()) {
      const response = await commandBus.execute<
        CreateExercise,
        Either<(InvalidExerciseName | NotCreatedExercise)[], Exercise>
      >(CreateExercise.with({ id: Uuid.generate(), name }))

      if (Either.isRight(response)) return

      this.errors.push(
        ...response.value.map((value) => ({
          code: value.code,
          name: value.__name__,
        })),
      )
    }
  },
)
