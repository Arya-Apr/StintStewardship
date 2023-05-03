import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tasks } from './tasks.entity';
import { Repository } from 'typeorm';
import { CreateTasksType } from './create-tasks.input';
import { v4 as uuid } from 'uuid';
import { SubjectService } from 'src/subject/subject.service';
import { StudentsService } from 'src/students/students.service';
import { Students } from 'src/students/students.entity';
import { TeachersService } from 'src/teachers/teachers.service';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Tasks) private tasksRepository: Repository<Tasks>,
    private subjectService: SubjectService,
    @Inject(forwardRef(() => StudentsService))
    private studentService: StudentsService,
    private teacherService: TeachersService,
  ) {}

  async createTask(createTasksType: CreateTasksType): Promise<Tasks> {
    const { task_name, semester, subject_code } = createTasksType;
    const subject = await this.subjectService.getSubjectById(subject_code);
    const student_ids = await this.studentService.getStudentsIdsBySem(semester);
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
        });
        await this.studentService.assignStudentsWithTask(task);
        return await this.tasksRepository.save(task);
      } else {
        throw new Error('Please Assign Task of your subject');
      }
    } else {
      throw new Error('Subject of that subject code was not found');
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
}
