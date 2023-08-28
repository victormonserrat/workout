import PostExerciseDto from '~/exercises/infrastructure/models/http/post-dto'

describe('PostExerciseDto', () => {
  const name = 'name'
  const postDto = PostExerciseDto.with({ name })

  it.concurrent('has a name', () => {
    expect(postDto).toHaveProperty('name')
  })

  it.concurrent('can be created', () => {
    expect(postDto.name).toBe(name)
  })
})
