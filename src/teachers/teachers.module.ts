import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teachers } from './teachers.entity';
import { TeachersResolver } from './teachers.resolver';
import { TeachersService } from './teachers.service';
import { SubjectModule } from 'src/subject/subject.module';

@Module({
  imports: [TypeOrmModule.forFeature([Teachers]), SubjectModule],
  providers: [TeachersResolver, TeachersService],
  exports: [TeachersService],
})
export class TeachersModule {}
