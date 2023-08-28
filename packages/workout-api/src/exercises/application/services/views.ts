import Either from '@victormonserrat/either'

import NotFoundExercise from '~/exercises/domain/exceptions/not-found'

import ExerciseView from '../models/view'

type ExerciseViews = Readonly<{
  add: (view: ExerciseView) => Promise<ExerciseView>
  withName: (name: string) => Promise<Either<NotFoundExercise, ExerciseView>>
}>

const ExerciseViews = 'ExerciseViews'

export default ExerciseViews
