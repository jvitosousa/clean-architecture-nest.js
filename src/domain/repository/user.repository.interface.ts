import { UserModel } from '../model/user.model';

export interface UserRepository {
  insert(user: UserModel): Promise<UserModel>;
  findAll(): Promise<UserModel[]>;
  findByName(name: string): Promise<UserModel>;
  findByEmail(email: string): Promise<UserModel>;
  updateContent(user: UserModel): Promise<void>;
  deleteById(id: number): Promise<void>;
  findById(id: number): Promise<any>;
}
