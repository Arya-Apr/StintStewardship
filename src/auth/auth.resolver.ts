import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './gql-auth-guard';
import { UserLoginInput } from './User-Login.input';

@Resolver()
@UseGuards(GqlAuthGuard)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => UserLoginInput)
  async studentLogin(
    @Args('loginUserInput') userLoginInput: UserLoginInput,
  ): Promise<{ accessToken: string }> {
    return this.authService.login(userLoginInput);
  }
}
