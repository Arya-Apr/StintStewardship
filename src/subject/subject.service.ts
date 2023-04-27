import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subject } from './subject.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { CreateSubjectInput } from './create-subject.input';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject) private subjectRepository: Repository<Subject>,
  ) {}

  async createSubject(
    createSubjectInput: CreateSubjectInput,
  ): Promise<Subject> {
    const { sub_code, sub_name } = createSubjectInput;
    const subject = await this.subjectRepository.create({
      subject_id: uuid(),
      sub_code,
      sub_name,
    });
    return await this.subjectRepository.save(subject);
  }

  async getSubjects(): Promise<Subject[]> {
    return await this.subjectRepository.find();
  }

  async getSubjectById(subject_code: number): Promise<Subject> {
    return await this.subjectRepository.findOneBy({ sub_code: subject_code });
  }
}
