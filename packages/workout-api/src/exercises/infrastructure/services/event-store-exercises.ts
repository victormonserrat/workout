import { EventStoreDBClient, jsonEvent, NO_STREAM } from '@eventstore/db-client'
import { Inject, Injectable } from '@nestjs/common'

import CreatedExercise from '~/exercises/domain/events/created'
import Exercise from '~/exercises/domain/models/exercise'
import Exercises from '~/exercises/domain/services/exercises'

@Injectable()
class EventStoreExercises implements Exercises {
  constructor(
    @Inject(EventStoreDBClient) private readonly client: EventStoreDBClient,
  ) {}

  async add(exercise: Exercise): Promise<Exercise> {
    await this.client.appendToStream(
      `${Exercise.__name__}-${exercise.id.value}`,
      jsonEvent({
        data: {
          id: exercise.id.value,
          name: exercise.name.value,
        },
        type: CreatedExercise.name,
      }),
      { expectedRevision: NO_STREAM },
    )

    return exercise
  }
}

export default EventStoreExercises
