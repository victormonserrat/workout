import ExerciseView from '~/exercises/application/models/view'
import Exercise from '~/exercises/domain/models/exercise'

type ExerciseTable = Readonly<
  {
    name: string
  }[]
>

const ExerciseTable = {
  fromExercises: (exercises: Exercise[]) =>
    exercises.map((value) => ({ name: value.name.value })),
  fromViews: (views: ExerciseView[]) =>
    views.map((value) => ({ name: value.name })),
} as const

export default ExerciseTable
