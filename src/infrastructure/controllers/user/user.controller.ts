import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiTags,
  ApiResponse,
  ApiExtraModels,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { JwtGuard } from '../../../infrastructure/common/guard/jwt.guard';
import { UseCaseProxy } from '../../../infrastructure/usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from '../../../infrastructure/usecases-proxy/usecases-proxy.module';
import { CreateUserUseCases } from '../../../usecases/user/createUser.usecases';
import { DeleteUserUsecase } from '../../../usecases/user/deleteUser.usecases';
import { GetUserUseCases } from '../../../usecases/user/getUser.usecases';
import { UserDto } from './user.dto';
import { UserPresenter } from './user.presenter';
import * as bcrypt from 'bcrypt';

@Controller('user')
@ApiTags('user')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(UserPresenter)
export class UserController {
  constructor(
    @Inject(UsecasesProxyModule.GET_USER_USECASES_PROXY)
    private readonly getUserUseCasesProxy: UseCaseProxy<GetUserUseCases>,
    @Inject(UsecasesProxyModule.POST_USER_USECASES_PROXY)
    private readonly postUserUseCasesProxy: UseCaseProxy<CreateUserUseCases>,
    @Inject(UsecasesProxyModule.DELETE_USER_USECASES_PROXY)
    private readonly deleteUserUseCasesProxy: UseCaseProxy<DeleteUserUsecase>,
  ) {}

  @UseGuards(JwtGuard)
  @Get()
  @ApiOkResponse({ type: UserPresenter })
  async getUser(@Query('name') name: string) {
    const result = await this.getUserUseCasesProxy.getInstance().execute(name);
    return new UserPresenter(result);
  }

  @ApiBody({ type: UserDto })
  @Post()
  @ApiCreatedResponse({
    description: 'The despesa has been successfully created.',
    type: UserPresenter,
  })
  async createUser(@Body() userDTO: UserDto) {
    const hash = bcrypt.hashSync(userDTO.password, 10);
    const result = await this.postUserUseCasesProxy
      .getInstance()
      .execute(userDTO.email, userDTO.name, hash);
    return new UserPresenter(result);
  }

  @UseGuards(JwtGuard)
  @Delete()
  @ApiCreatedResponse({
    description: 'The despesa has been successfully deleted.',
  })
  async deleteUser(@Req() req) {
    await this.deleteUserUseCasesProxy.getInstance().execute(req.user.username);
    return { message: 'User deleted' };
  }
}
