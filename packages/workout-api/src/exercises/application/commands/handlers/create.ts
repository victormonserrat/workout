import { Inject } from '@nestjs/common'
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs'
import { AggregateRoot, InvalidUuid } from '@victormonserrat/ddd'
import Either from '@victormonserrat/either'

import InvalidExerciseName from '~/exercises/domain/exceptions/invalid-name'
import Exercise from '~/exercises/domain/models/exercise'
import ExerciseId from '~/exercises/domain/models/id'
import ExerciseName from '~/exercises/domain/models/name'
import Exercises from '~/exercises/domain/services/exercises'

import NotCreatedExercise from '../../exceptions/not-created'
import ExerciseViews from '../../services/views'
import CreateExercise from '../create'

@CommandHandler(CreateExercise)
class CreateExerciseHandler implements ICommandHandler {
  constructor(
    private readonly events: EventBus,
    @Inject(Exercises) private readonly exercises: Exercises,
    @Inject(ExerciseViews) private readonly views: ExerciseViews,
  ) {}

  async execute(
    command: CreateExercise,
  ): Promise<
    Either<(InvalidUuid | InvalidExerciseName | NotCreatedExercise)[], Exercise>
  > {
    const exceptions = []
    const id = ExerciseId.fromString(command.id)
    const isInvalidId = Either.isLeft(id)
    const name = ExerciseName.fromString(command.name)
    const isInvalidName = Either.isLeft(name)
    const existsWithName =
      !isInvalidName &&
      Either.isRight(await this.views.withName(name.value.value))

    if (isInvalidId) exceptions.push(id.value)
    if (isInvalidName) exceptions.push(name.value)
    if (existsWithName)
      exceptions.push(
        NotCreatedExercise.causeAlreadyExistsOneWithName(name.value.value),
      )
    if (isInvalidId || isInvalidName || existsWithName)
      return Either.left(exceptions)

    const exercise = Exercise.with({ id: id.value, name: name.value })

    await this.exercises.add(exercise)
    this.events.publishAll(exercise.__events__)

    return Either.right(AggregateRoot.commit(exercise))
  }
}

export default CreateExerciseHandler
