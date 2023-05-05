import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TeachersService } from './teachers.service';
import { TeachersType } from './teachers.type';
import { Teachers } from './teachers.entity';
import { CreateTeachersInput } from './create-teacher.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { RolesGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { BroadcastInput } from './broadcast-student.input';

@Resolver(() => TeachersType)
export class TeachersResolver {
  constructor(private teachersService: TeachersService) {}

  @Mutation(() => TeachersType)
  async createTeacher(
    @Args('createTeacherInput') createTeacherInput: CreateTeachersInput,
  ): Promise<Teachers> {
    return this.teachersService.createTeacher(createTeacherInput);
  }

  @Query(() => [TeachersType])
  async getTeachers(): Promise<Teachers[]> {
    return this.teachersService.getTeachers();
  }

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Teacher)
  async broadcastBasedOnSem(
    @Args('EnterMessageAndSem') broadcast: BroadcastInput,
  ) {
    return this.teachersService.broadcastBasedOnSem(broadcast);
  }
}
