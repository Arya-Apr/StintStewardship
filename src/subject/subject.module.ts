import { Module } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectResolver } from './subject.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from './subject.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subject])],
  controllers: [],
  providers: [SubjectService, SubjectResolver],
  exports: [SubjectService],
})
export class SubjectModule {}
