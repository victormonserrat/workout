import { AggregateRoot } from '@victormonserrat/ddd'

import CreatedExercise from '../events/created'
import ExerciseId from './id'
import ExerciseName from './name'

const __name__ = 'Exercise'

type Exercise = AggregateRoot<typeof __name__, ExerciseId, CreatedExercise> &
  Readonly<{
    name: ExerciseName
  }>

const Exercise = {
  __name__,
  with: ({ id, name }: { id: ExerciseId; name: ExerciseName }): Exercise => ({
    ...AggregateRoot.with({
      __events__: [CreatedExercise.with({ id: id.value, name: name.value })],
      __name__,
      id,
    }),
    name,
  }),
} as const

export default Exercise
