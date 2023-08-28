import { itIsAValueObject } from '@victormonserrat/ddd'
import Either, { Left, Right } from '@victormonserrat/either'

import InvalidExerciseName from '~/exercises/domain/exceptions/invalid-name'
import ExerciseName from '~/exercises/domain/models/name'
import { itCanNotBeBlank } from '~/test/exercises/closures/name'

describe('ExerciseName', () => {
  const __name__ = 'ExerciseName'
  const value = 'value'
  const name = ExerciseName.fromString(value) as Right<ExerciseName>
  const blankName = ExerciseName.fromString(' ') as Left<InvalidExerciseName>

  itIsAValueObject(name.value)

  it.concurrent('can be created from string', () => {
    expect(Either.isRight(name)).toBe(true)
    expect(name.value.__name__).toBe(__name__)
    expect(name.value.value).toBe(value)
  })

  itCanNotBeBlank(blankName)
})
