import { Before, DataTable, Given, Then } from '@cucumber/cucumber'
import Uuid from '@victormonserrat/uuid'
import expect from 'expect'

import ExerciseView from '~/exercises/application/models/view'
import Exercise from '~/exercises/domain/models/exercise'
import ExerciseId from '~/exercises/domain/models/id'
import ExerciseName from '~/exercises/domain/models/name'
import InMemoryExercises from '~/exercises/infrastructure/services/in-memory-exercises'
import InMemoryExerciseViews from '~/exercises/infrastructure/services/in-memory-views'
import { Context as DefaultContext } from '~/test/shared/steps/common'

import ExerciseTable from '../tables/exercise'

export type Context = DefaultContext & {
  exercises: InMemoryExercises
  views: InMemoryExerciseViews
}

Before(function (this: Context) {
  this.exercises = InMemoryExercises.withExercises([])
  this.views = InMemoryExerciseViews.withViews([])
})

Given(
  'the exercise list currently looks as follows:',
  function (this: Context, dataTable: DataTable) {
    const list = dataTable.hashes().reduce(
      (previousValue, { name }) => {
        const id = Uuid.generate()

        return {
          exercises: [
            ...previousValue.exercises,
            Exercise.with({
              id: ExerciseId.fromString(id).value as ExerciseId,
              name: ExerciseName.fromString(name).value as ExerciseName,
            }),
          ],
          views: [...previousValue.views, ExerciseView.with({ id, name })],
        }
      },
      { exercises: [], views: [] },
    )

    this.exercises = InMemoryExercises.withExercises(list.exercises)
    this.views = InMemoryExerciseViews.withViews(list.views)
  },
)

Then(
  'I should see the following exercise list:',
  function (this: Context, dataTable: DataTable) {
    const table = dataTable.hashes()

    expect(ExerciseTable.fromExercises(this.exercises.exercises)).toStrictEqual(
      table,
    )
    expect(ExerciseTable.fromViews(this.views.views)).toStrictEqual(table)
  },
)
