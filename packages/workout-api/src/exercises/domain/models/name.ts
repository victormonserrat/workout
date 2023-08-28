import { ValueObject } from '@victormonserrat/ddd'
import Either from '@victormonserrat/either'

import InvalidExerciseName from '../exceptions/invalid-name'

const __name__ = 'ExerciseName'

type ExerciseName = ValueObject<typeof __name__, string>

const ExerciseName = {
  fromString: (value: string): Either<InvalidExerciseName, ExerciseName> => {
    const isBlank = !value.trim()

    if (isBlank) return Either.left(InvalidExerciseName.causeIsBlank())

    return Either.right(ValueObject.with({ __name__, value }))
  },
} as const

export default ExerciseName
