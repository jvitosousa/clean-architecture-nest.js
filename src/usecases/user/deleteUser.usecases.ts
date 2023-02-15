import { ILogger } from '../../domain/logger/logger.interface';
import { UserRepository } from '../../domain/repository/user.repository.interface';

export class DeleteUserUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly iLogger: ILogger,
  ) {}

  async execute(name: string): Promise<void> {
    const user = await this.userRepository.findByName(name);
    await this.userRepository.deleteById(user.id);
    this.iLogger.log('Delete User', `${user.id} - ${user.name} deleted`);
  }
}
