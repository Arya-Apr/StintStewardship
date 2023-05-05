import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Students } from './students.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { createTransport } from 'nodemailer';
import { CreateStudentInput } from './create-student.input.type';
import { Tasks } from 'src/tasks/tasks.entity';
import { TasksService } from 'src/tasks/tasks.service';
import { CommentTaskInput } from './comment-task-input';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Students) private studentRepository: Repository<Students>,
    @Inject(forwardRef(() => TasksService))
    private taskService: TasksService,
  ) {}

  async createStudent(
    createStudentInput: CreateStudentInput,
  ): Promise<Students> {
    const { stud_name, stud_roll, username, password, semester } =
      createStudentInput;

    const tasks_id = await this.taskService.getTasksBySem(semester);
    const student = await this.studentRepository.create({
      stud_id: uuid(),
      stud_name,
      stud_roll,
      username,
      password,
      semester,
      tasks: tasks_id || [],
      comment: [],
      role: 'student',
    });
    if (student) {
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
          to: `${student.username}`,
          subject: 'New Student Created',
          html: `<html>
            <body>
              <h1>New Student Created</h1>
              <p>Hello${student.stud_name}</p>
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
    await this.taskService.assignTasksToNewStudent(student);
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

  async getStudentUsernamesBySem(semester: number): Promise<any[]> {
    const students = await this.studentRepository.find({ where: { semester } });
    const usernames = students.map((student) => student.username);
    return usernames;
  }

  async removeTaskFromStudent(name: string) {
    const students = await this.studentRepository.find({
      where: { tasks: name },
    });
    for (const student of students) {
      const index = student.tasks.indexOf(name);
      if (index !== -1) {
        student.tasks.splice(index, 1);
        await this.studentRepository.update(student._id, {
          tasks: student.tasks,
        });
      }
    }
  }

  async searchStudentByName(stud_name: string): Promise<Students> {
    return await this.studentRepository.findOne({ where: { stud_name } });
  }

  async checkStudentByTaskName(stud_name: string, tasks_name: string) {
    const student = await this.searchStudentByName(stud_name);
    const res = student.tasks.includes(tasks_name);
    return res;
  }

  async commentOnTask(commentInput: CommentTaskInput) {
    const { stud_name, task_name, comment } = commentInput;
    const task = await this.taskService.searchTaskByName(task_name);
    const student = await this.searchStudentByName(stud_name);
    if (student) {
      const res = await this.checkStudentByTaskName(
        student.stud_name,
        task.task_name,
      );
      if (res) {
        student.comment = [...student.comment, comment];
        await this.studentRepository.save(student);
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
            to: student.username,
            subject: `Your Teacher Just Commented On Your Task ${task.task_name}`,
            html: `<html>
                  <body>
                    <h1>Comment</h1>
                    <p>${comment}</p>
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
        return res;
      }
      throw new Error('No such Task Found');
    }
    throw new Error('Student Not Found');
  }

  async viewTasksOfOtherStudents() {
    const students = await this.studentRepository.find();
  }
}
