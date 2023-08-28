import { Injectable } from '@nestjs/common'
import Either from '@victormonserrat/either'

import ExerciseView from '~/exercises/application/models/view'
import ExerciseViews from '~/exercises/application/services/views'
import NotFoundExercise from '~/exercises/domain/exceptions/not-found'

@Injectable()
class InMemoryExerciseViews implements ExerciseViews {
  private constructor(readonly views: ExerciseView[]) {}

  static withViews(views: ExerciseView[]) {
    return new InMemoryExerciseViews(views)
  }

  async add(view: ExerciseView): Promise<ExerciseView> {
    this.views.push(view)

    return view
  }

  async withName(
    name: string,
  ): Promise<Either<NotFoundExercise, ExerciseView>> {
    const foundView = this.views.find((view) => view.name === name)

    if (!foundView) return Either.left(NotFoundExercise.withName(name))

    return Either.right(ExerciseView.with(foundView))
  }
}

export default InMemoryExerciseViews
