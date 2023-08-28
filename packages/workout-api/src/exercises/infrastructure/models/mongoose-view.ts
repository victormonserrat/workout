import { Prop, Schema } from '@nestjs/mongoose'
import { UnnameType } from '@victormonserrat/name-type'

import ExerciseView from '~/exercises/application/models/view'

@Schema({ versionKey: false })
class MongooseExerciseView implements Omit<UnnameType<ExerciseView>, 'id'> {
  @Prop()
  readonly _id: string

  @Prop()
  readonly name: string

  constructor(_id: string, name: string) {
    this._id = _id
    this.name = name
  }

  static fromExerciseView(view: ExerciseView) {
    return new MongooseExerciseView(view.id, view.name)
  }

  static toExerciseView(view: MongooseExerciseView) {
    return ExerciseView.with({ id: view._id, name: view.name })
  }
}

export default MongooseExerciseView
