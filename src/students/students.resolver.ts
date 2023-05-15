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

  @Query(() => [FileType])
  async getFile(@Args('Cred') fileInput: FileInput): Promise<File[]> {
    return this.studentsService.getFile(fileInput);
  }
}
