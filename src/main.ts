import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GraphQLSchemaHost } from '@nestjs/graphql';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { printSchema } from 'graphql';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(3000);
  const { schema } = app.get(GraphQLSchemaHost);
  writeFileSync(join(process.cwd(), `/src/schema.gql`), printSchema(schema));
}
bootstrap();
