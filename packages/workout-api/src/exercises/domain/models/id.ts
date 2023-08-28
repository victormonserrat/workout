import { InvalidUuid, Uuid } from '@victormonserrat/ddd'
import Either from '@victormonserrat/either'
import NameType from '@victormonserrat/name-type'

const __name__ = 'ExerciseId'

type ExerciseId = NameType<Uuid, typeof __name__>

const ExerciseId = {
  fromString: (value: string): Either<InvalidUuid, ExerciseId> => {
    const uuid = Uuid.fromString(value)
    const isInvalidUuid = Either.isLeft(uuid)

    if (isInvalidUuid) return uuid

    return Either.right({ ...uuid.value, __name__ })
  },
} as const

export default ExerciseId
