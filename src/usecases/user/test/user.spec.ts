import { UserModel } from 'src/domain/model/user.model';
import { InterfaceAws } from '../../../domain/adapters/aws.interface';
import { ILogger } from '../../../domain/logger/logger.interface';
import { UserRepository } from '../../../domain/repository/user.repository.interface';
import { CreateUserUseCases } from '../createUser.usecases';
import { IBcryptService } from '../../../domain/adapters/bcrypt.interface';
import { GetUserUseCases } from '../getUser.usecases';
import { DeleteUserUsecase } from '../deleteUser.usecases';

describe('uses_cases/despesas', () => {
  let iAws: InterfaceAws;
  let logger: ILogger;
  let userRepository: UserRepository;
  let createUserUseCases: CreateUserUseCases;
  let iBcryptService: IBcryptService;
  let getUserUseCases: GetUserUseCases;
  let deleteUserUseCases: DeleteUserUsecase;

  beforeEach(() => {
    iAws = {} as InterfaceAws;
    iAws.sendEmail = jest.fn();

    logger = {} as ILogger;
    logger.log = jest.fn();

    userRepository = {} as UserRepository;
    userRepository.insert = jest.fn();
    userRepository.findByEmail = jest.fn();
    userRepository.updateContent = jest.fn();
    userRepository.deleteById = jest.fn();
    userRepository.findByName = jest.fn();

    iBcryptService = {} as IBcryptService;
    iBcryptService.hash = jest.fn();
    iBcryptService.compare = jest.fn();

    createUserUseCases = new CreateUserUseCases(
      iBcryptService,
      userRepository,
      logger,
    );

    getUserUseCases = new GetUserUseCases(userRepository);

    deleteUserUseCases = new DeleteUserUsecase(userRepository, logger);
  });

  describe('user usecases', () => {
    it('should create a user successfully', async () => {
      const user: UserModel = {
        id: 1,
        name: 'teste',
        email: 'email',
        password: '123',
        createdDate: undefined,
        updatedDate: undefined,
        deletedDate: undefined,
        isAdmin: false,
      };
      (userRepository.insert as jest.Mock).mockReturnValue(user);
      (logger.log as jest.Mock).mockReturnValue('User created');
      expect(
        await createUserUseCases.execute(user.email, user.name, user.password),
      ).toEqual(user);
    });
    it('should get a user successfully', async () => {
      const user: UserModel = {
        id: 1,
        name: 'teste',
        email: 'email',
        password: '123',
        createdDate: undefined,
        updatedDate: undefined,
        deletedDate: undefined,
        isAdmin: false,
      };
      (userRepository.findByName as jest.Mock).mockReturnValue(user);
      expect(await getUserUseCases.execute(user.name)).toEqual(user);
    });

    it('should delete a user successfully', async () => {
      const user: UserModel = {
        id: 1,
        name: 'teste',
        email: 'email',
        password: '123',
        createdDate: undefined,
        updatedDate: undefined,
        deletedDate: undefined,
        isAdmin: false,
      };
      (userRepository.findByName as jest.Mock).mockReturnValue(user);
      (userRepository.deleteById as jest.Mock).mockReturnValue(Promise<void>);
      (logger.log as jest.Mock).mockReturnValue('User deleted');
      expect(await deleteUserUseCases.execute(user.name)).toEqual(undefined);
    });
  });
});
