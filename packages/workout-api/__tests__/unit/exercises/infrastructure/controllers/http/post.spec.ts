import { BadRequestException } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { InvalidUuid } from '@victormonserrat/ddd'
import Either from '@victormonserrat/either'
import Uuid from '@victormonserrat/uuid'

import CreateExercise from '~/exercises/application/commands/create'
import NotCreatedExercise from '~/exercises/application/exceptions/not-created'
import InvalidExerciseName from '~/exercises/domain/exceptions/invalid-name'
import Exercise from '~/exercises/domain/models/exercise'
import ExerciseId from '~/exercises/domain/models/id'
import ExerciseName from '~/exercises/domain/models/name'
import PostExercise from '~/exercises/infrastructure/controllers/http/post'
import ExerciseDto from '~/exercises/infrastructure/models/http/dto'
import PostExerciseDto from '~/exercises/infrastructure/models/http/post-dto'
import CommandBusMock from '~/mocks/@nestjs/cqrs/command-bus'
import HttpError from '~/shared/infrastructure/models/http/error'

describe('PostExercise', () => {
  let commandBus: CommandBus
  let post: PostExercise
  const idValue = '54e31582-ce36-4a6f-ba72-81d0ae728121'
  const id = ExerciseId.fromString(idValue).value as ExerciseId
  const nameValue = 'name'
  const name = ExerciseName.fromString(nameValue).value as ExerciseName
  const exercise = Exercise.with({ id, name })
  const dto = ExerciseDto.fromExercise(exercise)

  beforeEach(() => {
    commandBus = CommandBusMock.mock()
    post = new PostExercise(commandBus)
  })

  it('post an exercise', async () => {
    const commandBusExecute = jest.spyOn(commandBus, 'execute')
    const uuidGenerate = jest.spyOn(Uuid, 'generate')

    uuidGenerate.mockReturnValue(idValue)
    commandBusExecute.mockResolvedValue(Either.right(exercise))

    const response = (await post.with(
      PostExerciseDto.with({ name: nameValue }),
    )) as ExerciseDto

    expect(uuidGenerate).toHaveBeenCalled()
    expect(commandBusExecute).toHaveBeenCalledWith(
      CreateExercise.with({ id: idValue, name: nameValue }),
    )
    expect(response.id).toBe(dto.id)
    expect(response.name).toBe(dto.name)
  })

  it.each([
    {
      invalidId: ' ',
      invalidName: ' ',
    },
    {
      invalidId: ' ',
      invalidName: undefined,
    },
    {
      invalidId: undefined,
      invalidName: ' ',
    },
  ])('can not post an invalid exercise', async ({ invalidId, invalidName }) => {
    const commandBusExecute = jest.spyOn(commandBus, 'execute')
    const uuidGenerate = jest.spyOn(Uuid, 'generate')
    const exceptions = [
      ...(invalidId ? [InvalidUuid.causeTheFormatIsNotValid(invalidId)] : []),
      ...(invalidName ? [InvalidExerciseName.causeIsBlank()] : []),
    ]

    uuidGenerate.mockReturnValue(invalidId ?? idValue)
    commandBusExecute.mockResolvedValue(Either.left(exceptions))

    await expect(
      post.with(PostExerciseDto.with({ name: invalidName ?? nameValue })),
    ).rejects.toThrow(
      new BadRequestException(HttpError.fromExceptions(exceptions)),
    )
    expect(uuidGenerate).toHaveBeenCalled()
    expect(commandBusExecute).toHaveBeenCalledWith(
      CreateExercise.with({
        id: invalidId ?? idValue,
        name: invalidName ?? nameValue,
      }),
    )
  })

  it.each([{ invalidId: ' ' }, { invalidId: undefined }])(
    'can not post an exercise with an already in use name',
    async ({ invalidId }) => {
      const commandBusExecute = jest.spyOn(commandBus, 'execute')
      const uuidGenerate = jest.spyOn(Uuid, 'generate')
      const exceptions = [
        ...(invalidId ? [InvalidUuid.causeTheFormatIsNotValid(invalidId)] : []),
        NotCreatedExercise.causeAlreadyExistsOneWithName(nameValue),
      ]

      uuidGenerate.mockReturnValue(invalidId ?? idValue)
      commandBusExecute.mockResolvedValue(Either.left(exceptions))

      await expect(
        post.with(PostExerciseDto.with({ name: nameValue })),
      ).rejects.toThrow(
        new BadRequestException(HttpError.fromExceptions(exceptions)),
      )

      expect(uuidGenerate).toHaveBeenCalled()
      expect(commandBusExecute).toHaveBeenCalledWith(
        CreateExercise.with({
          id: invalidId ?? idValue,
          name: nameValue,
        }),
      )
    },
  )
})
