/* eslint-disable prettier/prettier */
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { StudentsType } from './students.type';
import { StudentsService } from './students.service';
import { CreateStudentInput } from './create-student.input.type';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { CommentTaskInput } from './comment-task-input';
import { RolesGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { FileType } from './file.type';
import { FileInput } from './file.input';
import { File } from './file.entity';
import { MoveToStatusInput } from './moveToStatus.input';
import { Students } from './students.entity';

@Resolver(() => StudentsType)
export class StudentsResolver {
  constructor(private studentsService: StudentsService) {}

  @Mutation(() => StudentsType)
  async createStudent(
    @Args('createStudentInput') createStudentInput: CreateStudentInput,
  ) {
    return await this.studentsService.createStudent(createStudentInput);
  }

  @Query(() => [StudentsType])
  @UseGuards(JwtAuthGuard)
  getStudents() {
    return this.studentsService.getStudents();
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Teacher)
  async commentOnStudentTask(
    @Args('commentOnStudentTask') commentStudentTask: CommentTaskInput,
  ) {
    return this.studentsService.commentOnTask(commentStudentTask);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Student)
  async moveTaskToExecuting(
    @Args('moveToExecution')
    moveToStatusInput: MoveToStatusInput,
  ): Promise<boolean> {
    return this.studentsService.moveTaskToExecution(moveToStatusInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Student)
  async moveTaskToCompleted(
    @Args('moveToCompleted')
    moveToStatusInput: MoveToStatusInput,
  ): Promise<boolean> {
    return this.studentsService.moveTaskToCompleted(moveToStatusInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Student)
  async moveTaskToTodo(
    @Args('moveToTodo')
    moveToStatusInput: MoveToStatusInput,
  ): Promise<boolean> {
    return this.studentsService.moveTaskToTodo(moveToStatusInput);
  }

  @Query(() => [FileType])
  async getFile(@Args('Cred') fileInput: FileInput): Promise<File[]> {
    return this.studentsService.getFile(fileInput);
  }

  @Query(() => StudentsType)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Student)
  async getStudentByUsername(
    @Args('getStudentByName') username: string,
  ): Promise<Students> {
    return this.studentsService.getStudent(username);
  }

  @Query(() => [String])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Student)
  async getAllTodoOfStudent(
    @Args('userName') username: string,
  ): Promise<string[]> {
    return this.studentsService.getAllStudentTodo(username);
  }
}
