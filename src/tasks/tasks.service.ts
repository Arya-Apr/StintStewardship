import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tasks } from './tasks.entity';
import { Repository } from 'typeorm';
import { CreateTasksType } from './create-tasks.input';
import { v4 as uuid } from 'uuid';
import { SubjectService } from 'src/subject/subject.service';
import { StudentsService } from 'src/students/students.service';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Tasks) private tasksRepository: Repository<Tasks>,
    private subjectService: SubjectService,
    private studentService: StudentsService,
  ) {}

  async createTask(createTasksType: CreateTasksType): Promise<Tasks> {
    const { task_name, semester, subject_code } = createTasksType;
    const subject = await this.subjectService.getSubjectById(subject_code);
    const student_ids = await this.studentService.getStudentsIdsBySem(semester);
    if (subject) {
      const task = this.tasksRepository.create({
        tasks_id: uuid(),
        task_name,
        semester,
        subject_code: subject.sub_code,
        alloted_students: student_ids,
      });
      await this.studentService.assignStudentsWithTask(task);
      return await this.tasksRepository.save(task);
    } else return;
  }

  async getTasks(): Promise<Tasks[]> {
    const tasks = await this.tasksRepository.find();
    return tasks;
  }
}
