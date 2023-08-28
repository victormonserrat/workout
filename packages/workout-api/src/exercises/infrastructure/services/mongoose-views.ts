import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import Either from '@victormonserrat/either'
import { Model } from 'mongoose'

import ExerciseView from '~/exercises/application/models/view'
import ExerciseViews from '~/exercises/application/services/views'
import NotFoundExercise from '~/exercises/domain/exceptions/not-found'

import MongooseExerciseView from '../models/mongoose-view'

@Injectable()
class MongooseExerciseViews implements ExerciseViews {
  constructor(
    @InjectModel(MongooseExerciseView.name)
    private readonly views: Model<MongooseExerciseView>,
  ) {}

  async add(view: ExerciseView): Promise<ExerciseView> {
    await this.views.create(MongooseExerciseView.fromExerciseView(view))

    return view
  }

  async withName(
    name: string,
  ): Promise<Either<NotFoundExercise, ExerciseView>> {
    const mongooseView = await this.views.findOne({ name }).lean().exec()

    if (!mongooseView) return Either.left(NotFoundExercise.withName(name))

    return Either.right(MongooseExerciseView.toExerciseView(mongooseView))
  }
}

export default MongooseExerciseViews
