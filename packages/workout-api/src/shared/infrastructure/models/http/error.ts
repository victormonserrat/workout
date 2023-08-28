import { ApiProperty } from '@nestjs/swagger'
import { Exception } from '@victormonserrat/ddd'

type Error = Readonly<{
  code: number | string
  message: string
  name: string
}>

class HttpError {
  @ApiProperty()
  readonly errors: Error[]

  private constructor(errors: Error[]) {
    this.errors = errors
  }

  static fromExceptions(exceptions: Exception<string>[]): HttpError {
    return new HttpError(
      exceptions.map((value) => ({
        code: value.code,
        message: value.message,
        name: value.__name__,
      })),
    )
  }
}

export default HttpError
