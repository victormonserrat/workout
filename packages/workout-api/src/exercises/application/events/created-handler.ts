import { Inject } from '@nestjs/common'
import { EventsHandler, IEventHandler } from '@nestjs/cqrs'

import CreatedExercise from '~/exercises/domain/events/created'

import ExerciseView from '../models/view'
import ExerciseViews from '../services/views'

@EventsHandler(CreatedExercise)
class CreatedExerciseHandler implements IEventHandler<CreatedExercise> {
  constructor(@Inject(ExerciseViews) private readonly views: ExerciseViews) {}

  async handle(event: CreatedExercise): Promise<void> {
    await this.views.add(ExerciseView.with({ id: event.id, name: event.name }))
  }
}

export default CreatedExerciseHandler
