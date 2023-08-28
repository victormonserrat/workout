import { Exception } from '@victormonserrat/ddd'

import HttpError from '~/shared/infrastructure/models/http/error'

describe('HttpError', () => {
  const __name__ = 'name'
  const code = 'code'
  const message = 'message'
  const numericCode = 400
  const exception = Exception.with({ __name__, code, message })
  const numericCodeException = Exception.with({
    __name__,
    code: numericCode,
    message,
  })
  const error = HttpError.fromExceptions([exception, numericCodeException])

  it.concurrent('has errors', () => {
    expect(error).toHaveProperty('errors')
  })

  it.concurrent('can be created from exceptions', () => {
    expect(error.errors).toStrictEqual([
      { code, message, name: __name__ },
      { code: numericCode, message, name: __name__ },
    ])
  })
})
