import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Teachers } from './teachers.entity';
import { Repository } from 'typeorm';
import { CreateTeachersInput } from './create-teacher.input';
import { v4 as uuid } from 'uuid';
import { createTransport } from 'nodemailer';
import { SubjectService } from 'src/subject/subject.service';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teachers)
    private teachersRepository: Repository<Teachers>,
    private subjectService: SubjectService,
  ) {}

  async createTeacher(
    createTeacherInput: CreateTeachersInput,
  ): Promise<Teachers> {
    const { teacher_name, teacher_subject } = createTeacherInput;

    const subject = await this.subjectService.getSubjectByName(teacher_subject);
    if (subject) {
      const teacher = await this.teachersRepository.create({
        teacher_id: uuid(),
        teacher_name,
        teacher_subject,
      });
      if (teacher) {
        const mailTransporter = createTransport({
          host: 'smtp.ethereal.email',
          secure: false,
          auth: {
            user: 'leanna.schaefer41@ethereal.email',
            pass: 'zmqjbBNrGpQzqjaCKX',
          },
        });

        mailTransporter.sendMail(
          {
            from: 'leanna.schaefer41@ethereal.email',
            to: 'leanna.schaefer41@ethereal.email',
            subject: 'Demo',
            text: `hello`,
          },
          (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log('Email sent to user');
            }
          },
        );
      }
      return this.teachersRepository.save(teacher);
    } else {
      throw new Error('Subject Not Found');
    }
  }

  async getTeachers(): Promise<Teachers[]> {
    return await this.teachersRepository.find();
  }
}
