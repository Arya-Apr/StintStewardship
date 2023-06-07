/* eslint-disable prettier/prettier */
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
import { PersonalTasks } from 'src/tasks/perosonal.tasks.entity';
import { File } from './file.entity';
import { FileUploadDto } from './file.upload.dto';
import { FileInput } from './file.input';
import { MoveToStatusInput } from './moveToStatus.input';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Students) private studentRepository: Repository<Students>,
    @InjectRepository(File) private fileRepository: Repository<File>,
    @Inject(forwardRef(() => TasksService))
    private taskService: TasksService,
  ) {}

  async createStudent(
    createStudentInput: CreateStudentInput,
  ): Promise<Students> {
    const { stud_name, stud_roll, username, password, semester } =
      createStudentInput;

    const tasks_id = await this.taskService.getTasksBySem(semester);
    const student = this.studentRepository.create({
      stud_id: uuid(),
      stud_name,
      stud_roll,
      username,
      password,
      semester,
      tasks: tasks_id || [],
      comment: [],
      role: 'student',
      //doing this for the cycle of tasks
      taskwithstatus: {
        todo: tasks_id || [],
        executing: [],
        completed: [],
        review: [],
        finished: [],
      },
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
            console.log('Mail Sent To New Registered Student');
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
        (student) => (
          (student.tasks = [...student.tasks, task.task_name]),
          //assigning in todo
          (student.taskwithstatus.todo = [
            ...student.taskwithstatus.todo,
            task.task_name,
          ])
        ),
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
      const indexintodo = student.taskwithstatus.todo.indexOf(name);
      const indexinexecuting = student.taskwithstatus.executing.indexOf(name);
      const indexincompleted = student.taskwithstatus.completed.indexOf(name);
      const indexinreview = student.taskwithstatus.review.indexOf(name);
      const indexinfinished = student.taskwithstatus.finished.indexOf(name);

      if (index !== -1) {
        student.tasks.splice(index, 1);
        await this.studentRepository.update(student._id, {
          tasks: student.tasks,
        });
      }
      if (indexintodo !== -1) {
        student.taskwithstatus.todo.splice(indexintodo, 1);
        await this.studentRepository.update(student._id, {
          taskwithstatus: {
            todo: student.taskwithstatus.todo,
            executing: [...student.taskwithstatus.executing],
            completed: [...student.taskwithstatus.completed],
            review: [...student.taskwithstatus.review],
            finished: [...student.taskwithstatus.finished],
          },
        });
      }
      if (indexinexecuting !== -1) {
        student.taskwithstatus.executing.splice(indexinexecuting, 1);
        await this.studentRepository.update(student._id, {
          taskwithstatus: {
            todo: [...student.taskwithstatus.todo],
            executing: student.taskwithstatus.executing,
            completed: [...student.taskwithstatus.completed],
            review: [...student.taskwithstatus.review],
            finished: [...student.taskwithstatus.finished],
          },
        });
      }
      if (indexincompleted !== -1) {
        student.taskwithstatus.completed.splice(indexincompleted, 1);
        await this.studentRepository.update(student._id, {
          taskwithstatus: {
            todo: [...student.taskwithstatus.todo],
            executing: [...student.taskwithstatus.executing],
            completed: student.taskwithstatus.completed,
            review: [...student.taskwithstatus.review],
            finished: [...student.taskwithstatus.finished],
          },
        });
      }
      if (indexinreview !== -1) {
        student.taskwithstatus.review.splice(indexinreview, 1);
        await this.studentRepository.update(student._id, {
          taskwithstatus: {
            todo: [...student.taskwithstatus.todo],
            executing: [...student.taskwithstatus.executing],
            completed: [...student.taskwithstatus.completed],
            review: student.taskwithstatus.review,
            finished: [...student.taskwithstatus.finished],
          },
        });
      }
      if (indexinfinished !== -1) {
        student.taskwithstatus.finished.splice(indexinfinished, 1);
        await this.studentRepository.update(student._id, {
          taskwithstatus: {
            todo: [...student.taskwithstatus.todo],
            executing: [...student.taskwithstatus.executing],
            completed: [...student.taskwithstatus.completed],
            review: [...student.taskwithstatus.review],
            finished: student.taskwithstatus.finished,
          },
        });
      }
    }
  }

  async moveTaskToExecution(
    moveToStatusInput: MoveToStatusInput,
  ): Promise<boolean> {
    const { task_name, student_roll } = moveToStatusInput;
    const task = await this.taskService.searchTaskByName(task_name);
    const student = await this.studentRepository.findOne({
      where: { stud_roll: student_roll },
    });
    if (student) {
      const indexintodo = student.taskwithstatus.todo.indexOf(task_name);
      const indexincompleted =
        student.taskwithstatus.completed.indexOf(task_name);
      if (student.tasks.includes(task_name)) {
        if (task) {
          if (indexintodo !== -1) {
            student.taskwithstatus.todo.splice(indexintodo, 1);
            await this.studentRepository.update(student._id, {
              taskwithstatus: {
                todo: student.taskwithstatus.todo,
                executing: [
                  ...student.taskwithstatus.executing,
                  task.task_name,
                ],
                completed: [...student.taskwithstatus.completed],
                review: [...student.taskwithstatus.review],
                finished: [...student.taskwithstatus.finished],
              },
            });
            return true;
          } else if (indexincompleted !== -1) {
            student.taskwithstatus.completed.splice(indexincompleted, 1);
            await this.studentRepository.update(student._id, {
              taskwithstatus: {
                todo: [...student.taskwithstatus.todo],
                executing: [
                  ...student.taskwithstatus.executing,
                  task.task_name,
                ],
                completed: student.taskwithstatus.completed,
                review: [...student.taskwithstatus.review],
                finished: [...student.taskwithstatus.finished],
              },
            });
            return true;
          } else {
            return false;
          }
        } else {
          throw new Error('Task Not Found');
        }
      } else {
        throw new Error('This task is not for this student');
      }
    } else {
      throw new Error('Student Not Found');
    }
  }

  async moveTaskToCompleted(
    moveToStatusInput: MoveToStatusInput,
  ): Promise<boolean> {
    const { student_roll, task_name } = moveToStatusInput;
    const task = await this.taskService.searchTaskByName(task_name);
    const student = await this.studentRepository.findOne({
      where: { stud_roll: student_roll },
    });
    if (student) {
      const indexintodo = student.taskwithstatus.todo.indexOf(task_name);
      const indexinexecuting =
        student.taskwithstatus.executing.indexOf(task_name);
      if (student.tasks.includes(task_name)) {
        if (task) {
          if (indexintodo !== -1) {
            student.taskwithstatus.todo.splice(indexintodo, 1);
            await this.studentRepository.update(student._id, {
              taskwithstatus: {
                todo: student.taskwithstatus.todo,
                executing: [...student.taskwithstatus.executing],
                completed: [
                  ...student.taskwithstatus.completed,
                  task.task_name,
                ],
                review: [...student.taskwithstatus.review],
                finished: [...student.taskwithstatus.finished],
              },
            });
            return true;
          } else if (indexinexecuting !== -1) {
            student.taskwithstatus.executing.splice(indexinexecuting, 1);
            await this.studentRepository.update(student._id, {
              taskwithstatus: {
                todo: [...student.taskwithstatus.todo],
                executing: student.taskwithstatus.executing,
                completed: [
                  ...student.taskwithstatus.completed,
                  task.task_name,
                ],
                review: [...student.taskwithstatus.review],
                finished: [...student.taskwithstatus.finished],
              },
            });
            return true;
          } else {
            return false;
          }
        } else {
          throw new Error('Task Not Found');
        }
      } else {
        throw new Error('This task is not for this student');
      }
    } else {
      throw new Error('Student Not Found');
    }
  }

  async moveTaskToTodo(moveToStatusInput: MoveToStatusInput): Promise<boolean> {
    const { student_roll, task_name } = moveToStatusInput;
    const task = await this.taskService.searchTaskByName(task_name);
    const student = await this.studentRepository.findOne({
      where: { stud_roll: student_roll },
    });
    if (student) {
      const indexincompleted =
        student.taskwithstatus.completed.indexOf(task_name);
      const indexinexecuting =
        student.taskwithstatus.executing.indexOf(task_name);
      if (student.tasks.includes(task_name)) {
        if (task) {
          if (indexincompleted !== -1) {
            student.taskwithstatus.completed.splice(indexincompleted, 1);
            await this.studentRepository.update(student._id, {
              taskwithstatus: {
                todo: [...student.taskwithstatus.todo, task.task_name],
                executing: [...student.taskwithstatus.executing],
                completed: student.taskwithstatus.completed,
                review: [...student.taskwithstatus.review],
                finished: [...student.taskwithstatus.finished],
              },
            });
            return true;
          } else if (indexinexecuting !== -1) {
            student.taskwithstatus.executing.splice(indexinexecuting, 1);
            await this.studentRepository.update(student._id, {
              taskwithstatus: {
                todo: [...student.taskwithstatus.todo, task.task_name],
                executing: student.taskwithstatus.executing,
                completed: [...student.taskwithstatus.completed],
                review: [...student.taskwithstatus.review],
                finished: [...student.taskwithstatus.finished],
              },
            });
            return true;
          } else {
            return false;
          }
        } else {
          throw new Error('Task Not Found');
        }
      } else {
        throw new Error('This task is not for this student');
      }
    } else {
      throw new Error('Student Not Found');
    }
  }

  async moveTaskToFinished(
    moveToStatusInput: MoveToStatusInput,
  ): Promise<boolean> {
    const { student_roll, task_name } = moveToStatusInput;
    const task = await this.taskService.searchTaskByName(task_name);
    const student = await this.studentRepository.findOne({
      where: { stud_roll: student_roll },
    });
    if (student) {
      const indexincompleted =
        student.taskwithstatus.completed.indexOf(task_name);
      const indexinexecuting =
        student.taskwithstatus.executing.indexOf(task_name);
      const indexintodo = student.taskwithstatus.todo.indexOf(task_name);
      const indexinreview = student.taskwithstatus.review.indexOf(task_name);
      if (student.tasks.includes(task_name)) {
        if (task) {
          if (indexincompleted !== -1) {
            student.taskwithstatus.completed.splice(indexincompleted, 1);
            await this.studentRepository.update(student._id, {
              taskwithstatus: {
                todo: [...student.taskwithstatus.todo],
                executing: [...student.taskwithstatus.executing],
                completed: student.taskwithstatus.completed,
                review: [...student.taskwithstatus.review],
                finished: [...student.taskwithstatus.finished, task.task_name],
              },
            });
            return true;
          } else if (indexinexecuting !== -1) {
            student.taskwithstatus.executing.splice(indexinexecuting, 1);
            await this.studentRepository.update(student._id, {
              taskwithstatus: {
                todo: [...student.taskwithstatus.todo],
                executing: student.taskwithstatus.executing,
                completed: [...student.taskwithstatus.completed],
                review: [...student.taskwithstatus.review],
                finished: [...student.taskwithstatus.finished, task.task_name],
              },
            });
            return true;
          } else if (indexintodo !== -1) {
            student.taskwithstatus.todo.splice(indexintodo, 1);
            await this.studentRepository.update(student._id, {
              taskwithstatus: {
                todo: student.taskwithstatus.todo,
                executing: [...student.taskwithstatus.executing],
                completed: [...student.taskwithstatus.completed],
                review: [...student.taskwithstatus.review],
                finished: [...student.taskwithstatus.finished, task.task_name],
              },
            });
            return true;
          } else if (indexinreview !== -1) {
            student.taskwithstatus.review.splice(indexinreview, 1);
            await this.studentRepository.update(student._id, {
              taskwithstatus: {
                todo: [...student.taskwithstatus.todo],
                executing: [...student.taskwithstatus.executing],
                completed: [...student.taskwithstatus.completed],
                review: student.taskwithstatus.review,
                finished: [...student.taskwithstatus.finished, task.task_name],
              },
            });
            return true;
          } else {
            return false;
          }
        } else {
          throw new Error('Task Not Found');
        }
      } else {
        throw new Error('This task is not for this student');
      }
    } else {
      throw new Error('Student Not Found');
    }
  }

  async moveTaskToReview(
    moveToStatusInput: MoveToStatusInput,
  ): Promise<boolean> {
    const { student_roll, task_name } = moveToStatusInput;
    const task = await this.taskService.searchTaskByName(task_name);
    const student = await this.studentRepository.findOne({
      where: { stud_roll: student_roll },
    });
    if (student) {
      const indexincompleted =
        student.taskwithstatus.completed.indexOf(task_name);
      const indexinexecuting =
        student.taskwithstatus.executing.indexOf(task_name);
      const indexintodo = student.taskwithstatus.todo.indexOf(task_name);
      const indexinfinished =
        student.taskwithstatus.finished.indexOf(task_name);
      if (student.tasks.includes(task_name)) {
        if (task) {
          if (indexincompleted !== -1) {
            student.taskwithstatus.completed.splice(indexincompleted, 1);
            await this.studentRepository.update(student._id, {
              taskwithstatus: {
                todo: [...student.taskwithstatus.todo],
                executing: [...student.taskwithstatus.executing],
                completed: student.taskwithstatus.completed,
                review: [...student.taskwithstatus.review, task.task_name],
                finished: [...student.taskwithstatus.finished],
              },
            });
            return true;
          } else if (indexinexecuting !== -1) {
            student.taskwithstatus.executing.splice(indexinexecuting, 1);
            await this.studentRepository.update(student._id, {
              taskwithstatus: {
                todo: [...student.taskwithstatus.todo],
                executing: student.taskwithstatus.executing,
                completed: [...student.taskwithstatus.completed],
                review: [...student.taskwithstatus.review, task.task_name],
                finished: [...student.taskwithstatus.finished],
              },
            });
            return true;
          } else if (indexintodo !== -1) {
            student.taskwithstatus.todo.splice(indexintodo, 1);
            await this.studentRepository.update(student._id, {
              taskwithstatus: {
                todo: student.taskwithstatus.todo,
                executing: [...student.taskwithstatus.executing],
                completed: [...student.taskwithstatus.completed],
                review: [...student.taskwithstatus.review, task.task_name],
                finished: [...student.taskwithstatus.finished],
              },
            });
            return true;
          } else if (indexinfinished !== -1) {
            student.taskwithstatus.finished.splice(indexinfinished, 1);
            await this.studentRepository.update(student._id, {
              taskwithstatus: {
                todo: [...student.taskwithstatus.todo],
                executing: [...student.taskwithstatus.executing],
                completed: [...student.taskwithstatus.completed],
                review: [...student.taskwithstatus.review, task.task_name],
                finished: student.taskwithstatus.finished,
              },
            });
            return true;
          } else {
            return false;
          }
        } else {
          throw new Error('Task Not Found');
        }
      } else {
        throw new Error('This task is not for this student');
      }
    } else {
      throw new Error('Student Not Found');
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
              console.log('Mail Sent To Student For The Comment');
            }
          },
        );
        return res;
      }
      throw new Error('No such Task Found');
    }
    throw new Error('Student Not Found');
  }
  async getStudentById(stud_id: string) {
    return this.studentRepository.findOneBy({ stud_id });
  }

  async assignStudentsWithCustomTask(task: PersonalTasks) {
    const student = await this.getStudent(task.username);
    student.tasks = [...student.tasks, task.task_name];
    await this.studentRepository.save(student);
  }

  async uploadFile(filename: string, fileUploadDto: FileUploadDto) {
    const { stud_Id, taskName } = fileUploadDto;
    const task = await this.taskService.searchTaskByName(taskName);
    if (task) {
      const student = await this.getStudentById(stud_Id);
      if (student) {
        const file = await this.fileRepository.create({
          fileName: filename,
          stud_id: stud_Id,
          file_id: uuid(),
          task_Name: task.task_name,
        });
        return this.fileRepository.save(file);
      }
      throw new Error('Student was not found please check your Id');
    }
    throw new Error('No Such Task Found');
  }

  async getFile(fileInput: FileInput): Promise<File[]> {
    const { stud_id, task_name } = fileInput;
    const file = await this.fileRepository.find({
      where: {
        task_Name: task_name,
        stud_id,
      },
    });
    if (file.length !== 0) {
      return file;
    } else if (file.length === 0) {
      throw new Error(
        'Student Id or the task name was inccorect, please enter correct inputs',
      );
    }
  }

  async getAllStudentTodo(username: string) {
    const student = await this.getStudent(username);
    if (student) {
      const todos = student.taskwithstatus.todo.map((task) => {
        return task;
      });
      return todos;
    }
  }

  async getAllStudentExecuting(username: string) {
    const student = await this.getStudent(username);
    if (student) {
      const executing = student.taskwithstatus.executing.map((task) => {
        return task;
      });
      return executing;
    }
  }

  async getAllStudentCompletedList(username: string) {
    const student = await this.getStudent(username);
    if (student) {
      const completed = student.taskwithstatus.completed.map((task) => {
        return task;
      });
      return completed;
    }
  }

  async getAllStudentReviewList(username: string) {
    const student = await this.getStudent(username);
    if (student) {
      const review = student.taskwithstatus.review.map((task) => {
        return task;
      });
      return review;
    }
  }

  async getAllStudentFinishedList(username: string) {
    const student = await this.getStudent(username);
    if (student) {
      const finished = student.taskwithstatus.finished.map((task) => {
        return task;
      });
      return finished;
    }
  }
}
