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
  @Roles(Role.Teacher)
  async moveTaskToFinished(
    @Args('moveToFinished')
    moveToStatusInput: MoveToStatusInput,
  ): Promise<boolean> {
    return this.studentsService.moveTaskToFinished(moveToStatusInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async movePersonalTaskToFinished(
    @Args('moveToFinished')
    moveToStatusInput: MoveToStatusInput,
  ): Promise<boolean> {
    return this.studentsService.movePersonalTaskToFinished(moveToStatusInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Teacher)
  async moveTaskToReview(
    @Args('moveToReview')
    moveToStatusInput: MoveToStatusInput,
  ): Promise<boolean> {
    return this.studentsService.moveTaskToReview(moveToStatusInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async movePersonalTaskToReview(
    @Args('moveToReview')
    moveToStatusInput: MoveToStatusInput,
  ): Promise<boolean> {
    return this.studentsService.movePersonalTaskToReview(moveToStatusInput);
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

  @Query(() => [String])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Student)
  async getAllPersonalTodoOfStudent(
    @Args('userName') username: string,
  ): Promise<string[]> {
    return this.studentsService.getAllStudentPersonalTodo(username);
  }

  @Query(() => [String])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Student)
  async getAllCompletedOfStudent(
    @Args('userName') username: string,
  ): Promise<string[]> {
    return this.studentsService.getAllStudentCompletedList(username);
  }
  @Query(() => [String])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Student)
  async getAllPersonalCompletedOfStudent(
    @Args('userName') username: string,
  ): Promise<string[]> {
    return this.studentsService.getAllStudentPersonalCompletedList(username);
  }

  @Query(() => [String])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Student)
  async getAllExecutingOfStudent(
    @Args('userName') username: string,
  ): Promise<string[]> {
    return this.studentsService.getAllStudentExecuting(username);
  }

  @Query(() => [String])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Student)
  async getAllPersonalExecutingOfStudent(
    @Args('userName') username: string,
  ): Promise<string[]> {
    return this.studentsService.getAllStudentPersonalExecuting(username);
  }

  @Query(() => [String])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Student)
  async getAllReviewOfStudent(
    @Args('userName') username: string,
  ): Promise<string[]> {
    return this.studentsService.getAllStudentReviewList(username);
  }

  @Query(() => [String])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Student)
  async getAllPersonalReviewOfStudent(
    @Args('userName') username: string,
  ): Promise<string[]> {
    return this.studentsService.getAllStudentPersonalReviewList(username);
  }

  @Query(() => [String])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Student)
  async getAllFinishedOfStudent(
    @Args('userName') username: string,
  ): Promise<string[]> {
    return this.studentsService.getAllStudentFinishedList(username);
  }

  @Query(() => [String])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Student)
  async getAllPersonalFinishedOfStudent(
    @Args('userName') username: string,
  ): Promise<string[]> {
    return this.studentsService.getAllStudentPerosnalFinishedList(username);
  }

  @Query(() => [Number])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Student)
  async getCountOfPersonalTasks(@Args('username') username: string) {
    return this.studentsService.getCountOfPersonalTasks(username);
  }

  @Query(() => [Number])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Student)
  async getCountOfSchoolTasks(@Args('username') username: string) {
    return this.studentsService.getCountOfSchoolTasks(username);
  }

  @Query(() => [[Number]])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Student)
  async getAllCount(@Args('username') username: string) {
    return this.studentsService.getCountOfAllTask(username);
  }
  @Query(() => [String])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Student)
  async getRecent(@Args('username') username: string) {
    return this.studentsService.getRecentTasks(username);
  }
}
