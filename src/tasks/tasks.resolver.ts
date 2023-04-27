import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { TasksType } from './tasks.type';
import { TasksService } from './tasks.service';
import { Tasks } from './tasks.entity';
import { CreateTasksType } from './create-tasks.input';
import { SubjectService } from 'src/subject/subject.service';

@Resolver(() => TasksType)
export class TasksResolver {
  constructor(
    private tasksService: TasksService,
    private subjectService: SubjectService,
  ) {}

  @Mutation(() => TasksType)
  async createTask(
    @Args('createTasksType') createTasksType: CreateTasksType,
  ): Promise<Tasks> {
    return await this.tasksService.createTask(createTasksType);
  }

  @Query(() => [TasksType])
  async getTasks(): Promise<Tasks[]> {
    return await this.tasksService.getTasks();
  }
}
