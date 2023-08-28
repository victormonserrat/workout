import NameType, { UnnameType } from '@victormonserrat/name-type'

const __name__ = 'ExerciseView'

type ExerciseView = NameType<
  Readonly<{
    id: string
    name: string
  }>,
  typeof __name__
>

const ExerciseView = {
  with: (props: UnnameType<ExerciseView>): ExerciseView => ({
    ...props,
    __name__,
  }),
} as const

export default ExerciseView
