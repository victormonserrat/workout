import { itIsAnException } from '@victormonserrat/ddd'

import InvalidExerciseName from '~/exercises/domain/exceptions/invalid-name'

describe('InvalidExerciseName', () => {
  const __name__ = 'InvalidExerciseName'
  const invalidName = InvalidExerciseName.causeIsBlank()

  itIsAnException(invalidName)

  it.concurrent('can be cause is blank', () => {
    expect(invalidName.__name__).toBe(__name__)
    expect(invalidName.code).toBe('blank')
    expect(invalidName.message).toBe('Exercise name can not be blank')
  })
})
