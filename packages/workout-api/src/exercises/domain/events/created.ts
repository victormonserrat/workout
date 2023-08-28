import NameType, { UnnameType } from '@victormonserrat/name-type'

const __name__ = 'CreatedExercise'

type CreatedExerciseType = NameType<
  Readonly<{
    id: string
    name: string
  }>,
  typeof __name__
>

class CreatedExercise implements CreatedExerciseType {
  readonly __name__ = __name__

  private constructor(readonly id: string, readonly name: string) {}

  static with({ id, name }: UnnameType<CreatedExerciseType>): CreatedExercise {
    return new CreatedExercise(id, name)
  }
}

export default CreatedExercise
