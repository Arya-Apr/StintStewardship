import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { StudentsModule } from './students/students.module';
// import { TeachersModule } from './teachers/teachers.module';
import { SubjectModule } from './subject/subject.module';
import { Students } from './students/students.entity';
import { ApolloDriver } from '@nestjs/apollo';
import { Tasks } from './tasks/tasks.entity';
// import { Teachers } from './teachers/teachers.entity';
import { Subject } from './subject/subject.entity';
import { Teachers } from './teachers/teachers.entity';
import { TeachersModule } from './teachers/teachers.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: `mongodb`,
      url: `${process.env.DB_URL}`,
      synchronize: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoLoadEntities: true,
      entities: [Students, Tasks, Teachers, Subject],
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      driver: ApolloDriver,
    }),
    TasksModule,
    StudentsModule,
    TeachersModule,
    SubjectModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
