import { EventStoreDBClient } from '@eventstore/db-client'

export const eventStoreClientProvider = {
  provide: EventStoreDBClient,
  useFactory: () =>
    EventStoreDBClient.connectionString(process.env.EVENTSTOREDB_URI),
}
