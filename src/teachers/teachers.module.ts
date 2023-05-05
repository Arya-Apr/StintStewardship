import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teachers } from './teachers.entity';
import { TeachersResolver } from './teachers.resolver';
import { TeachersService } from './teachers.service';
import { SubjectModule } from 'src/subject/subject.module';
import { StudentsModule } from 'src/students/students.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Teachers]),
    forwardRef(() => StudentsModule),
    forwardRef(() => SubjectModule),
  ],
  providers: [TeachersResolver, TeachersService],
  exports: [TeachersService],
})
export class TeachersModule {}
