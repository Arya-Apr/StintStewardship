import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Students } from './students.entity';
import { StudentsResolver } from './students.resolver';
import { StudentsService } from './students.service';

@Module({
  imports: [TypeOrmModule.forFeature([Students])],
  providers: [StudentsResolver, StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
