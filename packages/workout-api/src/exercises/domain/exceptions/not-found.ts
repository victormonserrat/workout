import { Exception } from '@victormonserrat/ddd'
import { UnnameType } from '@victormonserrat/name-type'

const __name__ = 'NotFoundExercise'

type Code = 'not_found'

type NotFoundExercise = Exception<typeof __name__, Code>

const NotFoundExercise = {
  with: (props: UnnameType<NotFoundExercise>): NotFoundExercise =>
    Exception.with({ ...props, __name__ }),
  withName: (name: string): NotFoundExercise =>
    NotFoundExercise.with({
      code: 'not_found',
      message: `Exercise with name ${name} can not be found`,
    }),
} as const

export default NotFoundExercise
