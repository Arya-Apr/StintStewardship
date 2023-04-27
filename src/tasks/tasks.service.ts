import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tasks } from './tasks.entity';
import { Repository } from 'typeorm';
import { CreateTasksType } from './create-tasks.input';
import { v4 as uuid } from 'uuid';
import { SubjectService } from 'src/subject/subject.service';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Tasks) private tasksRepository: Repository<Tasks>,
    private subjectService: SubjectService,
  ) {}

  async createTask(createTasksType: CreateTasksType): Promise<Tasks> {
    const { task_name, semester, subject_code } = createTasksType;
    const subject = await this.subjectService.getSubjectById(subject_code);
    if (subject) {
      const task = await this.tasksRepository.create({
        tasks_id: uuid(),
        task_name,
        semester,
        subject_code: subject.sub_code,
      });
      return await this.tasksRepository.save(task);
    } else return;
  }

  async getTasks(): Promise<Tasks[]> {
    return await this.tasksRepository.find();
  }
}
