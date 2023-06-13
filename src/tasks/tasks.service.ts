/* eslint-disable prettier/prettier */
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tasks } from './tasks.entity';
import { Between, Repository } from 'typeorm';
import { CreateTasksType } from './create-tasks.input';
import { v4 as uuid } from 'uuid';
import { SubjectService } from 'src/subject/subject.service';
import { StudentsService } from 'src/students/students.service';
import { Students } from 'src/students/students.entity';
import { TeachersService } from 'src/teachers/teachers.service';
import { createTransport } from 'nodemailer';
import { CreateCustomTasksType } from './task-custom.input.type';
import { PersonalTasks } from './perosonal.tasks.entity';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(PersonalTasks)
    private personalTasksRepository: Repository<PersonalTasks>,
    @InjectRepository(Tasks) private tasksRepository: Repository<Tasks>,
    private subjectService: SubjectService,
    @Inject(forwardRef(() => StudentsService))
    private studentService: StudentsService,
    private teacherService: TeachersService,
  ) {}

  async createTask(createTasksType: CreateTasksType): Promise<Tasks> {
    const { task_name, semester, subject_code, deadline } = createTasksType;
    if (task_name !== '' && semester) {
      const subject = await this.subjectService.getSubjectById(subject_code);
      const student_ids = await this.studentService.getStudentsIdsBySem(
        semester,
      );
      const usernames = await this.studentService.getStudentUsernamesBySem(
        semester,
      );
      if (subject) {
        const teacher = await this.teacherService.getTeacherBySub(
          subject.sub_name,
        );
        if (teacher) {
          const task = this.tasksRepository.create({
            tasks_id: uuid(),
            task_name,
            semester,
            subject_code: subject.sub_code,
            alloted_students: student_ids || [],
            teacher: teacher.teacher_name,
            deadline: deadline,
          });
          await this.studentService.assignStudentsWithTask(task);
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
              to: Array.isArray(usernames) ? usernames.join(',') : usernames,
              subject: `New Task Assigned for Subject ${subject.sub_name}`,
              html: `<html>
                  <body>
                    <h1>New Tasks for ${subject.sub_code}</h1>
                    <p>No deadline for now, Tasks is ${task.task_name}</p>
                  </body>
            </html>`,
            },
            (err) => {
              if (err) {
                console.log(err);
              } else {
                console.log('Mails Sent To Students For New Task Created');
              }
            },
          );
          mailTransporter.sendMail(
            {
              from: `${process.env.USER}`,
              to: `${teacher.username}`,
              subject: `Created This Task Successfully`,
              html: `<html>
                  <body>
                    <h1>Created New Task For Students of Sem ${task.semester}</h1>
                    <p>The Email was sent to all the Students, the students are ${task.alloted_students}</p>
                  </body>
            </html>`,
            },
            (err) => {
              if (err) {
                console.log(err);
              } else {
                console.log('Email Sent To Teacher For Creating New Task');
              }
            },
          );
          return await this.tasksRepository.save(task);
        } else {
          throw new Error('Please Assign Task of your subject');
        }
      } else {
        throw new Error('Subject of that subject code was not found');
      }
    } else {
      throw new Error('Task Name And Semester Cannot Be Empty');
    }
  }

  async getTasks(): Promise<Tasks[]> {
    const tasks = await this.tasksRepository.find();
    return tasks;
  }

  async getTasksBySem(semester: number) {
    const tasks = await this.tasksRepository.find({ where: { semester } });
    return tasks.map((task) => task.task_name);
  }

  async assignTasksToNewStudent(student: Students) {
    const tasks = await this.tasksRepository.find({
      where: { semester: student.semester },
    });
    tasks.map(
      (task) =>
        (task.alloted_students = [...task.alloted_students, student.stud_id]),
    );
    await this.tasksRepository.save(tasks);
  }

  async deleteTask(id: string) {
    const task_to_delete = await this.tasksRepository.findOne({
      where: { tasks_id: id },
    });
    const per_task_to_del = await this.personalTasksRepository.findOne({
      where: { tasks_id: id },
    });
    if (task_to_delete) {
      await this.studentService.removeTaskFromStudent(task_to_delete.task_name);
      const result = await this.tasksRepository.delete(task_to_delete._id);
      return result.affected > 0;
    } else if (per_task_to_del) {
      await this.studentService.removeTaskFromStudent(
        per_task_to_del.task_name,
      );
      const result = await this.personalTasksRepository.delete(
        per_task_to_del._id,
      );
      return result.affected > 0;
    } else {
      return false;
    }
  }

  async deleteTaskForTeacher(id: string) {
    const per_task_to_del = await this.personalTasksRepository.findOne({
      where: { tasks_id: id },
    });
    if (per_task_to_del) {
      await this.teacherService.removeTaskFromTeacher(
        per_task_to_del.task_name,
      );
      const result = await this.personalTasksRepository.delete(
        per_task_to_del._id,
      );
      return result.affected > 0;
    } else {
      return false;
    }
  }

  async searchTaskByName(task_name: string): Promise<Tasks> {
    return await this.tasksRepository.findOne({ where: { task_name } });
  }

  async createTaskForPersonal(createCustomTasksInput: CreateCustomTasksType) {
    const { task_name, content, username, deadline } = createCustomTasksInput;
    if (task_name !== '') {
      const teacher = await this.teacherService.getTeacher(username);
      const student = await this.studentService.getStudent(username);
      if (teacher) {
        const user = this.personalTasksRepository.create({
          tasks_id: uuid(),
          task_name,
          content,
          username,
          deadline: deadline,
          alloted_user: teacher.teacher_id,
        });
        const createdTask = await this.personalTasksRepository.save(user);
        await this.teacherService.assignTeacherWithPersonalTask(createdTask);
        return createdTask;
      } else if (student) {
        const user = this.personalTasksRepository.create({
          tasks_id: uuid(),
          content,
          task_name,
          username,
          deadline: deadline,
          alloted_user: student.stud_id,
        });
        const createdTask = await this.personalTasksRepository.save(user);
        this.studentService.assignStudentWithPersonalTask(createdTask);
        return createdTask;
      } else {
        throw new Error('User Not Found, Please Register As One');
      }
    } else {
      throw new Error('Task Name Cannot Be Empty');
    }
  }

  async getSemFromTasks() {
    const tasks = await this.tasksRepository.find();
    const semesters = tasks.map((task) => task.semester);
    return semesters;
  }

  async checkDeadlines() {
    const now = new Date();
    const approachingDeadlines = await this.tasksRepository.find({
      where: {
        deadline: Between(now, new Date(now.getTime() + 24 * 60 * 60 * 1000)),
      },
    });

    if (approachingDeadlines.length === 0) {
      console.log('no deadlines yet');
    }
    const semesters = await this.getSemFromTasks();
    const usernames = semesters.map((semester) =>
      this.studentService.getStudentUsernamesBySem(semester),
    );
    approachingDeadlines.forEach((task) => {
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
          to: Array.isArray(usernames) ? usernames.join(',') : usernames,
          subject: `Deadline Approaching for Task ${task.task_name}`,
          html: `<html>
                <body>
                  <h1>Make Sure To Complete This Tasks</h1>
                  <p>Complete It Quickly</p>
                </body>
          </html>`,
        },
        (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log('Mails Sent To Students For Deadline');
            return true;
          }
        },
      );
    });
  }

  async getPersonalTaskByName(task_name: string) {
    const task = await this.personalTasksRepository.findOne({
      where: { task_name },
    });
    if (task) {
      return task;
    }
  }

  async getTaskByName(name: string) {
    const task = await this.tasksRepository.findOne({
      where: { task_name: name },
    });
    if (task) {
      return task;
    }
  }

  async getTasksByTeacher(username: string) {
    if (username) {
      const teacher = await this.teacherService.getTeacher(username);
      if (teacher) {
        const tasks = this.tasksRepository.find({
          where: { teacher: teacher.teacher_name },
        });
        return tasks;
      } else {
        throw new Error('Teacher Not Found');
      }
    }
  }
}
