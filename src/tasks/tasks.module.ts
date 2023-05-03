import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tasks } from './tasks.entity';
// import { StudentsModule } from 'src/students/students.module';
import { TasksResolver } from './tasks.resolver';
import { TasksService } from './tasks.service';
import { SubjectModule } from 'src/subject/subject.module';
import { StudentsModule } from 'src/students/students.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tasks]),
    SubjectModule,
    forwardRef(() => StudentsModule),
  ],
  providers: [TasksResolver, TasksService],
  exports: [TasksService, TasksModule],
})
export class TasksModule {}
