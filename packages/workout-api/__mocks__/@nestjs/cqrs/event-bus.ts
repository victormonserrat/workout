import { EventBus } from '@nestjs/cqrs'

const EventBusMock = {
  mock: () => ({ publishAll: jest.fn() } as unknown as EventBus),
} as const

export default EventBusMock
