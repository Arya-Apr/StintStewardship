import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Students } from './students.entity';
import { StudentsResolver } from './students.resolver';
import { StudentsService } from './students.service';
import { TasksModule } from 'src/tasks/tasks.module';
import { TeachersModule } from 'src/teachers/teachers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Students]),
    forwardRef(() => TasksModule),
    forwardRef(() => TeachersModule),
  ],
  providers: [StudentsResolver, StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
