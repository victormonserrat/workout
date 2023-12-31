import { NamedType } from '~/index'

export const expectIsNamed = (value: NamedType) => {
  expect(value).toHaveProperty('__name__')
}

export const itIsNamed = (value: NamedType) => {
  it.concurrent('is named', () => {
    expectIsNamed(value)
  })
}
