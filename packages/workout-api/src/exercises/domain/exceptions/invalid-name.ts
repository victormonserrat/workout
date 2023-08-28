import { Exception } from '@victormonserrat/ddd'
import { UnnameType } from '@victormonserrat/name-type'

const __name__ = 'InvalidExerciseName'

type Code = 'blank'

type InvalidExerciseName = Exception<typeof __name__, Code>

const InvalidExerciseName = {
  causeIsBlank: (): InvalidExerciseName =>
    InvalidExerciseName.with({
      code: 'blank',
      message: 'Exercise name can not be blank',
    }),
  with: (props: UnnameType<InvalidExerciseName>): InvalidExerciseName =>
    Exception.with({ ...props, __name__ }),
} as const

export default InvalidExerciseName
