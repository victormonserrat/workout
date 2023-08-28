import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose'

import { eventStoreClientProvider } from '~/shared/infrastructure/providers'

import CreateExerciseHandler from '../application/commands/handlers/create'
import CreatedExerciseHandler from '../application/events/created-handler'
import PostExercise from './controllers/http/post'
import MongooseExerciseView from './models/mongoose-view'
import exerciseProviders from './providers'

@Module({
  controllers: [PostExercise],
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: MongooseExerciseView.name,
        schema: SchemaFactory.createForClass(MongooseExerciseView),
      },
    ]),
  ],
  providers: [
    eventStoreClientProvider,
    CreateExerciseHandler,
    CreatedExerciseHandler,
    ...exerciseProviders,
  ],
})
class ExercisesModule {}

export default ExercisesModule
