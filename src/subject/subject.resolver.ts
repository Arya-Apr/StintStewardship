import { Mutation, Resolver, Query, Args } from '@nestjs/graphql';
import { SubjectService } from './subject.service';
import { SubjectType } from './subject.type';
import { Subject } from './subject.entity';
import { CreateSubjectInput } from './create-subject.input';

@Resolver(() => SubjectType)
export class SubjectResolver {
  constructor(private subjectService: SubjectService) {}

  @Mutation(() => SubjectType)
  async createSubject(
    @Args('createSubjectInput') createSubjectInput: CreateSubjectInput,
  ): Promise<Subject> {
    return this.subjectService.createSubject(createSubjectInput);
  }

  @Query(() => [SubjectType])
  async getSubjects(): Promise<Subject[]> {
    return await this.subjectService.getSubjects();
  }

  @Query(() => SubjectType)
  async getSubjectById(
    @Args('subject_code') subject_code: number,
  ): Promise<Subject> {
    return await this.subjectService.getSubjectById(subject_code);
  }
}
