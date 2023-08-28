import {
  InvalidUuid,
  itCanNotHaveInvalidFormat,
  itIsAValueObject,
} from '@victormonserrat/ddd'
import Either, { Left, Right } from '@victormonserrat/either'

import ExerciseId from '~/exercises/domain/models/id'

describe('ExerciseId', () => {
  const __name__ = 'ExerciseId'
  const value = '54e31582-ce36-4a6f-ba72-81d0ae728121'
  const id = ExerciseId.fromString(value) as Right<ExerciseId>
  const invalidFormatIds = [
    ExerciseId.fromString(' '),
    ExerciseId.fromString('invalid'),
  ] as Left<InvalidUuid>[]

  itIsAValueObject(id.value)

  it.concurrent('can be created from string', () => {
    expect(Either.isRight(id)).toBe(true)
    expect(id.value.__name__).toBe(__name__)
    expect(id.value.value).toBe(value)
  })

  itCanNotHaveInvalidFormat(...invalidFormatIds)
})
