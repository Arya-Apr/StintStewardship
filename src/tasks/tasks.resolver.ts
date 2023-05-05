import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { TasksType } from './tasks.type';
import { TasksService } from './tasks.service';
import { Tasks } from './tasks.entity';
import { CreateTasksType } from './create-tasks.input';
import { SubjectService } from 'src/subject/subject.service';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { RolesGuard } from 'src/auth/role.guard';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { CreateCustomTasksType } from './task-custom.input.type';
import { PersonalTasksType } from './task.input.custom';

@Resolver(() => TasksType)
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksResolver {
  constructor(
    private tasksService: TasksService,
    private subjectService: SubjectService,
  ) {}

  @Mutation(() => TasksType)
  @Roles(Role.Teacher)
  async createTask(
    @Args('createTasksType') createTasksType: CreateTasksType,
  ): Promise<Tasks> {
    return await this.tasksService.createTask(createTasksType);
  }

  @Roles(Role.Teacher)
  @Query(() => [TasksType])
  async getTasks(): Promise<Tasks[]> {
    return await this.tasksService.getTasks();
  }

  @Roles(Role.Teacher)
  @Mutation(() => Boolean)
  async deleteTask(@Args('id') id: string) {
    return this.tasksService.deleteTask(id);
  }

  @Mutation(() => PersonalTasksType)
  async createTaskForPersonal(
    @Args('createForPersonalUse') createCustomTasksInput: CreateCustomTasksType,
  ) {
    return this.tasksService.createTaskForPersonal(createCustomTasksInput);
  }
}
