import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Students } from './students.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { createTransport } from 'nodemailer';
import { CreateStudentInput } from './create-student.input.type';
import { Tasks } from 'src/tasks/tasks.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Students) private studentRepository: Repository<Students>,
  ) {}

  async createStudent(
    createStudentInput: CreateStudentInput,
  ): Promise<Students> {
    const { stud_name, stud_roll, username, password, semester } =
      createStudentInput;
    const student = await this.studentRepository.create({
      stud_id: uuid(),
      stud_name,
      stud_roll,
      username,
      password,
      semester,
      tasks: [''],
      role: 'student',
    });

    if (student) {
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

    return await this.studentRepository.save(student);
  }

  async getStudentsIdsBySem(semester: number): Promise<any[]> {
    const students = await this.studentRepository.find({
      where: { semester },
    });
    return students.map((student) => student.stud_id);
  }

  async getStudents(): Promise<Students[]> {
    return await this.studentRepository.find();
  }

  async getStudent(username: string): Promise<Students> {
    const student = await this.studentRepository.findOne({
      where: { username },
    });
    return student;
  }

  async getStudentsBySemester(semester: number): Promise<Students[]> {
    return this.studentRepository.find({ where: { semester } });
  }

  async assignStudentsWithTask(task: Tasks) {
    if (task.alloted_students) {
      const students = await this.getStudentsBySemester(task.semester);
      students.map(
        (student) => (student.tasks = [...student.tasks, task.task_name]),
      );
      await this.studentRepository.save(students);
    }
  }
}
