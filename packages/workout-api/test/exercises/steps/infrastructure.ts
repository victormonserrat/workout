import { DataTable, When } from '@cucumber/cucumber'
import { BadRequestException } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { Test } from '@nestjs/testing'

import CreateExerciseHandler from '~/exercises/application/commands/handlers/create'
import CreatedExerciseHandler from '~/exercises/application/events/created-handler'
import ExerciseViews from '~/exercises/application/services/views'
import Exercises from '~/exercises/domain/services/exercises'
import PostExercise from '~/exercises/infrastructure/controllers/http/post'
import HttpError from '~/shared/infrastructure/models/http/error'

import { Context } from './common'

When(
  /^I create the following exercises?:$/,
  async function (this: Context, dataTable: DataTable) {
    const module = await Test.createTestingModule({
      controllers: [PostExercise],
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
    const post = module.get(PostExercise)

    await module.createNestApplication().init()

    for (const { name } of dataTable.hashes()) {
      try {
        await post.with({ name })
      } catch (exception) {
        if (!(exception instanceof BadRequestException)) throw exception

        const response = exception.getResponse() as HttpError

        this.errors.push(
          ...response.errors.map((value) => ({
            code: value.code,
            name: value.name,
          })),
        )
      }
    }
  },
)
