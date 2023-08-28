import NameType, { UnnameType } from '@victormonserrat/name-type'

const __name__ = 'CreateExercise'

type CreateExerciseType = NameType<
  Readonly<{
    id: string
    name: string
  }>,
  typeof __name__
>

class CreateExercise implements CreateExerciseType {
  readonly __name__ = __name__

  private constructor(readonly id: string, readonly name: string) {}

  static with({ id, name }: UnnameType<CreateExerciseType>): CreateExercise {
    return new CreateExercise(id, name)
  }
}

export default CreateExercise
