import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import AppModule from './module'

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule)
  const config = new DocumentBuilder()
    .setTitle('Workout API')
    .setDescription('The Workout API description')
    .setVersion('0.0.1')
    .build()
  const document = SwaggerModule.createDocument(app, config)

  app.useGlobalPipes(new ValidationPipe())
  SwaggerModule.setup('api', app, document)
  await app.listen(3000)
}

bootstrap()
