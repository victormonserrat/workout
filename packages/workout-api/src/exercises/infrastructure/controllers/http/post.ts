import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import Either from '@victormonserrat/either'
import Uuid from '@victormonserrat/uuid'

import CreateExercise from '~/exercises/application/commands/create'
import CreateExerciseHandler from '~/exercises/application/commands/handlers/create'
import HttpError from '~/shared/infrastructure/models/http/error'

import ExerciseDto from '../../models/http/dto'
import PostExerciseDto from '../../models/http/post-dto'

@ApiTags('Exercises')
@Controller('exercises')
class PostExercise {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: 'Creates an Exercise resource' })
  @ApiCreatedResponse({
    description: 'Exercise resource created',
    type: ExerciseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @Post()
  async with(@Body() dto: PostExerciseDto): Promise<ExerciseDto> {
    const id = Uuid.generate()

    const response: Awaited<ReturnType<CreateExerciseHandler['execute']>> =
      await this.commandBus.execute(CreateExercise.with({ id, name: dto.name }))

    if (Either.isLeft(response))
      throw new BadRequestException(HttpError.fromExceptions(response.value))

    return ExerciseDto.fromExercise(response.value)
  }
}

export default PostExercise
