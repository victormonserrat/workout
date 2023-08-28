import Either, { Left } from '@victormonserrat/either'

import InvalidExerciseName from '~/exercises/domain/exceptions/invalid-name'

export const expectCanNotBeBlank = (value: Left<InvalidExerciseName>) => {
  const invalidName = InvalidExerciseName.causeIsBlank()

  expect(Either.isRight(value)).toBe(false)
  expect(value.value.__name__).toBe(invalidName.__name__)
  expect(value.value.code).toBe(invalidName.code)
}

export const itCanNotBeBlank = (...values: Left<InvalidExerciseName>[]) => {
  it.concurrent.each(values)(
    'can not be blank',
    (value: Left<InvalidExerciseName>) => {
      expectCanNotBeBlank(value)
    },
  )
}
