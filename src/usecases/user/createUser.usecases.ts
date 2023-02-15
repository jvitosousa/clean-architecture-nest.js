import { IBcryptService } from '../../domain/adapters/bcrypt.interface';
import { ILogger } from '../../domain/logger/logger.interface';
import { UserModel } from '../../domain/model/user.model';
import { UserRepository } from '../../domain/repository/user.repository.interface';

export class CreateUserUseCases {
  constructor(
    private readonly bcrypt: IBcryptService,
    private readonly userRepository: UserRepository,
    private readonly iLogger: ILogger,
  ) {}

  async execute(
    email: string,
    name: string,
    password: string,
  ): Promise<UserModel> {
    const user = new UserModel();
    user.email = email;
    user.name = name;
    user.password = password;
    const result = await this.userRepository.insert(user);
    this.iLogger.log('Create User', 'secessfully');
    return result;
  }
}
