import { EventStoreDBClient } from '@eventstore/db-client'
import { HttpServer, INestApplication } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CqrsModule } from '@nestjs/cqrs'
import { getModelToken, MongooseModule, SchemaFactory } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'
import Uuid from '@victormonserrat/uuid'
import { Connection, Model } from 'mongoose'
import * as request from 'supertest'

import CreateExerciseHandler from '~/exercises/application/commands/handlers/create'
import CreatedExerciseHandler from '~/exercises/application/events/created-handler'
import NotCreatedExercise from '~/exercises/application/exceptions/not-created'
import ExerciseViews from '~/exercises/application/services/views'
import InvalidExerciseName from '~/exercises/domain/exceptions/invalid-name'
import Exercises from '~/exercises/domain/services/exercises'
import PostExercise from '~/exercises/infrastructure/controllers/http/post'
import MongooseExerciseView from '~/exercises/infrastructure/models/mongoose-view'
import EventStoreExercises from '~/exercises/infrastructure/services/event-store-exercises'
import MongooseExerciseViews from '~/exercises/infrastructure/services/mongoose-views'
import HttpError from '~/shared/infrastructure/models/http/error'

describe('Create exercise', () => {
  let app: INestApplication
  let server: HttpServer

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [PostExercise],
      imports: [
        ConfigModule.forRoot({ envFilePath: ['.env.test.local', '.env.test'] }),
        MongooseModule.forRootAsync({
          useFactory: () => ({ uri: process.env.MONGODB_URI }),
        }),
        MongooseModule.forFeature([
          {
            name: MongooseExerciseView.name,
            schema: SchemaFactory.createForClass(MongooseExerciseView),
          },
        ]),
        CqrsModule,
      ],
      providers: [
        {
          provide: EventStoreDBClient,
          useFactory: () =>
            EventStoreDBClient.connectionString(process.env.EVENTSTOREDB_URI),
        },
        CreateExerciseHandler,
        CreatedExerciseHandler,
        {
          provide: Exercises,
          useClass: EventStoreExercises,
        },
        {
          provide: ExerciseViews,
          useClass: MongooseExerciseViews,
        },
      ],
    }).compile()

    app = module.createNestApplication()
    await app.init()
    server = app.getHttpServer()
  })

  afterEach(async () => {
    const eventStore = app.get(EventStoreDBClient)
    const events = eventStore.readAll()
    const mongoose = app.get<Connection>('DatabaseConnection')

    for await (const resolvedEvent of events) {
      if (!resolvedEvent.event || resolvedEvent.event.type.startsWith('$'))
        continue

      try {
        await eventStore.tombstoneStream(resolvedEvent.event.streamId)
      } catch {}
    }

    await mongoose.dropDatabase()
  })

  it('creates an exercise', async () => {
    const name = 'name'
    const response = await request(server).post('/exercises').send({ name })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.name).toBe(name)
  })

  it('can not create an invalid exercise', async () => {
    const name = ' '
    const response = await request(server).post('/exercises').send({ name })

    expect(response.status).toBe(400)
    expect(response.body.errors).toStrictEqual(
      HttpError.fromExceptions([InvalidExerciseName.causeIsBlank()]).errors,
    )
  })

  it('can not create an exercise with an already in use name', async () => {
    const mongooseViews = app.get<Model<MongooseExerciseView>>(
      getModelToken(MongooseExerciseView.name),
    )
    const name = 'name'

    await mongooseViews.insertMany([
      {
        _id: Uuid.generate(),
        name,
      },
    ])

    const response = await request(server).post('/exercises').send({ name })

    expect(response.status).toBe(400)
    expect(response.body.errors).toStrictEqual(
      HttpError.fromExceptions([
        NotCreatedExercise.causeAlreadyExistsOneWithName(name),
      ]).errors,
    )
  })

  afterAll(async () => {
    await app.close()
  })
})
