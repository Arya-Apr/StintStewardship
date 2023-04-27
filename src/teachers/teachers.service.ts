import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Teachers } from './teachers.entity';
import { Repository } from 'typeorm';
import { CreateTeachersInput } from './create-teacher.input';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teachers)
    private teachersRepository: Repository<Teachers>,
  ) {}

  async createTeacher(
    createTeacherInput: CreateTeachersInput,
  ): Promise<Teachers> {
    const { teacher_name } = createTeacherInput;
    const teacher = await this.teachersRepository.create({
      teacher_id: uuid(),
      teacher_name,
    });
    return this.teachersRepository.save(teacher);
  }

  async getTeachers(): Promise<Teachers[]> {
    return await this.teachersRepository.find();
  }
}
