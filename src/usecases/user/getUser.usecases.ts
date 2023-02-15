import { UserModel } from '../../domain/model/user.model';
import { UserRepository } from '../../domain/repository/user.repository.interface';

export class GetUserUseCases {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(name: string): Promise<UserModel> {
    return await this.userRepository.findByName(name);
  }
}
