import { Exception } from '@victormonserrat/ddd'
import NameType, { UnnameType } from '@victormonserrat/name-type'

const __name__ = 'NotCreatedExercise'

type Code = 'used_name'

type NotCreatedExercise = NameType<Exception<Code>, typeof __name__>

const NotCreatedExercise = {
  causeAlreadyExistsOneWithName: (name: string): NotCreatedExercise =>
    NotCreatedExercise.with({
      code: 'used_name',
      message: `Exercise name ${name} is already in use`,
    }),
  with: (props: UnnameType<NotCreatedExercise>): NotCreatedExercise =>
    Exception.with({ ...props, __name__ }),
} as const

export default NotCreatedExercise
