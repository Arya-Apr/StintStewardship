import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teachers } from './teachers.entity';
// import { SubjectModule } from 'src/subject/subject.module';
import { Subject } from 'src/subject/subject.entity';
import { TeachersResolver } from './teachers.resolver';
import { TeachersService } from './teachers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Teachers]), Subject],
  providers: [TeachersResolver, TeachersService],
})
export class TeachersModule {}
