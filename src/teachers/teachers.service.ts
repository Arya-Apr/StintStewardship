import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Teachers } from './teachers.entity';
import { Repository } from 'typeorm';
import { CreateTeachersInput } from './create-teacher.input';
import { v4 as uuid } from 'uuid';
import { createTransport } from 'nodemailer';
import { SubjectService } from 'src/subject/subject.service';
import { BroadcastInput } from './broadcast-student.input';
import { StudentsService } from 'src/students/students.service';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teachers)
    private teachersRepository: Repository<Teachers>,
    private subjectService: SubjectService,
    @Inject(forwardRef(() => StudentsService))
    private studentService: StudentsService,
  ) {}

  async createTeacher(
    createTeacherInput: CreateTeachersInput,
  ): Promise<Teachers> {
    const { teacher_name, teacher_subject, username, password } =
      createTeacherInput;

    const subject = await this.subjectService.getSubjectByName(teacher_subject);
    if (subject) {
      const teacher = this.teachersRepository.create({
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
            to: `${teacher.username}`,
            subject: 'New Teacher Created',
            html: `<html>
              <body>
                <h1>New Teacher Created</h1>
                <p>Greetings! ${teacher.teacher_name}</p>
              </body>
            </html>`,
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

  async getTeacherBySub(subject: string) {
    const teacher = await this.teachersRepository.findOne({
      where: { teacher_subject: subject },
    });
    return teacher;
  }

  async broadcastBasedOnSem(broadcast: BroadcastInput) {
    const { name_of_teacher, message, semester } = broadcast;
    const teacher = await this.teachersRepository.findOne({
      where: { teacher_name: name_of_teacher },
    });
    const usernames = await this.studentService.getStudentUsernamesBySem(
      semester,
    );
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

      if (usernames) {
        mailTransporter.sendMail(
          {
            from: `${process.env.USER}`,
            to: Array.isArray(usernames) ? usernames.join(',') : usernames,
            subject: `This is a BroadCast Message For all Students of Sem ${semester}`,
            html: `<html>
          <body>
            <h1>Message</h1>
            <p>Greetings! ${message}</p>
          </body>
        </html>`,
          },
          (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log('Email sent to user');
            }
          },
        );
        return `Message Sent to Students of Sem ${semester}`;
      }
      throw new Error(`No Students of sem ${semester} yet`);
    }
    throw new Error('Teacher Not Found');
  }
}
