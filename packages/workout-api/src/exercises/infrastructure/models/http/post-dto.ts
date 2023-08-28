import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

class PostExerciseDto {
  @ApiProperty()
  @IsString()
  readonly name: string

  private constructor(name: string) {
    this.name = name
  }

  static with({ name }: { name: string }): PostExerciseDto {
    return new PostExerciseDto(name)
  }
}

export default PostExerciseDto
