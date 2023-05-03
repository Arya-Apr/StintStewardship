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
    const { teacher_name, teacher_subject, username, password } =
      createTeacherInput;

    const subject = await this.subjectService.getSubjectByName(teacher_subject);
    if (subject) {
      const teacher = await this.teachersRepository.create({
        teacher_id: uuid(),
        teacher_name,
        teacher_subject,
        password,
        username,
        role: 'teacher',
      });
      if (teacher) {
        const mailTransporter = createTransport({
          service: 'gmail',
          host: 'smtp.gmail.com',
          secure: false,
          auth: {
            user: `${process.env.USER}`,
            pass: `${process.env.PASS}`,
          },
        });

        mailTransporter.sendMail(
          {
            from: `${process.env.USER}`,
            to: 'aryarana49@gmail.com',
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

  async getTeacher(username: string): Promise<Teachers> {
    const teacher = await this.teachersRepository.findOne({
      where: {
        username,
      },
    });

    return teacher;
  }
}
