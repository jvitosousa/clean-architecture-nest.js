import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from '../../domain/model/user.model';
import { UserRepository } from '../../domain/repository/user.repository.interface';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class DataBaseUserRepository implements UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userEntityRepository: Repository<User>,
    @Inject(LoggerService)
    private readonly loggerService: LoggerService,
  ) {}

  async findById(id: number): Promise<any> {
    try {
      const userEntity = await this.userEntityRepository.findOneByOrFail({
        id,
      });
      if (!userEntity) {
        this.loggerService.warn('Ger user by id', 'user not found');
      }
      return userEntity;
    } catch (error) {
      LoggerService.error(error.message, error.stack);
      throw new Error(error);
    }
  }
  async findByEmail(email: string): Promise<UserModel> {
    try {
      const userEntity = await this.userEntityRepository.findOneBy({
        email: email,
      });
      if (!userEntity) {
        this.loggerService.error('User not found', '');
      }
      return this.toUserModel(userEntity);
    } catch (error) {
      LoggerService.error(error.message, error.stack);
    }
  }
  async insert(user: UserModel): Promise<UserModel> {
    try {
      const userEntity = this.toUserEntity(user);
      const result = await this.userEntityRepository.insert(userEntity);
      return this.toUserModel(result.generatedMaps[0] as User);
    } catch (error) {
      throw new Error(error);
    }
  }
  async findAll(): Promise<UserModel[]> {
    try {
      const users = await this.userEntityRepository.find();
      if (!users) this.loggerService.error('Get All Users', 'users not found');
      return users.map((user) => this.toUserModel(user));
    } catch (error) {
      this.loggerService.error(error.message, error.stack);
      throw new Error(error);
    }
  }

  async findByName(name: string): Promise<UserModel> {
    try {
      const userEntity = await this.userEntityRepository.findOneByOrFail({
        name,
      });
      if (!userEntity) {
        this.loggerService.error('Get user by name', 'user not found');
      }
      return this.toUserModel(userEntity);
    } catch (error) {
      LoggerService.error(error.message, error.stack);
      throw new Error(error);
    }
  }
  async updateContent(user: UserModel): Promise<void> {
    try {
      const userEntity = this.toUserEntity(user);
      await this.userEntityRepository.update(userEntity.id, userEntity);
    } catch (error) {
      this.loggerService.error(error.message, error.stack);
      throw new Error(error);
    }
  }
  async deleteById(id: number): Promise<void> {
    try {
      await this.userEntityRepository.softDelete(id);
    } catch (error) {
      this.loggerService.error(error.message, error.stack);
      throw new Error(error);
    }
  }

  public toUserModel(user: User): UserModel {
    const userModel: UserModel = new UserModel();
    userModel.id = user.id;
    userModel.name = user.name;
    userModel.email = user.email;
    userModel.createdDate = user.createdAt;
    userModel.password = user.password;
    return userModel;
  }

  private toUserEntity(userModel: UserModel): User {
    const user: User = new User();

    user.id = userModel.id;
    user.name = userModel.name;
    user.email = userModel.email;
    user.password = userModel.password;
    return user;
  }
}
