import { IBcryptService } from '../../../domain/adapters/bcrypt.interface';
import { InterfaceJwtService } from '../../../domain/adapters/jwt.interface';
import { JWTConfig } from '../../../domain/config/jwt.interface';
import { ILogger } from '../../../domain/logger/logger.interface';
import { UserModel } from '../../../domain/model/user.model';
import { UserRepository } from '../../../domain/repository/user.repository.interface';
import { LoginUseCase } from '../login.usecase';
import { LogoutUseCases } from '../logout.usecase';

describe('uses_cases/authentication', () => {
  let loginUseCases: LoginUseCase;
  let logoutUseCases: LogoutUseCases;
  let logger: ILogger;
  let jwtService: InterfaceJwtService;
  let jwtConfig: JWTConfig;
  let adminUserRepo: UserRepository;
  let bcryptService: IBcryptService;

  beforeEach(() => {
    logger = {} as ILogger;
    logger.log = jest.fn();

    jwtService = {} as InterfaceJwtService;
    jwtService.createToken = jest.fn();

    jwtConfig = {} as JWTConfig;
    jwtConfig.getExpirationTime = jest.fn();
    jwtConfig.getSecret = jest.fn();

    adminUserRepo = {} as UserRepository;
    adminUserRepo.findByName = jest.fn();
    adminUserRepo.findByEmail = jest.fn();

    bcryptService = {} as IBcryptService;
    bcryptService.compare = jest.fn();
    bcryptService.hash = jest.fn();

    loginUseCases = new LoginUseCase(
      logger,
      jwtService,
      jwtConfig,
      adminUserRepo,
      bcryptService,
    );
    logoutUseCases = new LogoutUseCases();
  });

  describe('creating a cookie', () => {
    it('should return a cookie', async () => {
      const user: UserModel = {
        id: 1,
        email: 'userEmail',
        password: 'password',
        createdDate: new Date(),
        updatedDate: new Date(),
        name: 'userName',
        deletedDate: undefined,
        isAdmin: false,
      };
      (adminUserRepo.findByEmail as jest.Mock).mockReturnValue(
        Promise.resolve(user),
      );
      const expireIn = '200';
      const token = 'token';
      (jwtConfig.getSecret as jest.Mock).mockReturnValue(() => 'secret');
      (jwtConfig.getExpirationTime as jest.Mock).mockReturnValue(expireIn);
      (jwtService.createToken as jest.Mock).mockReturnValue(token);

      expect(await loginUseCases.getCookieJwt('username')).toEqual('token');
    });
  });

  describe('validation local strategy', () => {
    it('should return null because user not found', async () => {
      (adminUserRepo.findByEmail as jest.Mock).mockReturnValue(
        Promise.resolve(null),
      );

      expect(await loginUseCases.validateLogin('email', 'password')).toEqual(
        null,
      );
    });

    it('should return null because wrong password', async () => {
      const user: UserModel = {
        id: 1,
        email: 'userEmail',
        password: 'password',
        createdDate: new Date(),
        updatedDate: new Date(),
        name: 'userName',
        deletedDate: undefined,
        isAdmin: false,
      };
      (adminUserRepo.findByEmail as jest.Mock).mockReturnValue(
        Promise.resolve(user),
      );
      (bcryptService.compare as jest.Mock).mockReturnValue(
        Promise.resolve(false),
      );

      expect(
        await loginUseCases.validateLogin('userEmail', 'wrongPassword'),
      ).toEqual(null);
    });
    it('should return pass validation', async () => {
      const user: UserModel = {
        id: 1,
        email: 'username',
        password: 'password',
        createdDate: new Date(),
        updatedDate: new Date(),
        name: 'userName',
        deletedDate: undefined,
        isAdmin: false,
      };
      (adminUserRepo.findByEmail as jest.Mock).mockReturnValue(
        Promise.resolve(user),
      );
      (bcryptService.compare as jest.Mock).mockReturnValue(
        Promise.resolve(true),
      );

      expect(
        await loginUseCases.validateLogin('userEmail', 'password'),
      ).toEqual(user);
    });
  });

  describe('Validation jwt strategy', () => {
    it('should return error because user not found', async () => {
      (adminUserRepo.findByName as jest.Mock).mockReturnValue(
        Promise.resolve(null),
      );
      (bcryptService.compare as jest.Mock).mockReturnValue(
        Promise.resolve(false),
      );

      expect(await loginUseCases.validateLoginJwt('username')).toEqual(null);
    });

    it('should return user successfully', async () => {
      const user: UserModel = {
        id: 1,
        email: 'userEmail',
        password: 'password',
        createdDate: new Date(),
        updatedDate: new Date(),
        name: 'userName',
        deletedDate: undefined,
        isAdmin: false,
      };
      (adminUserRepo.findByName as jest.Mock).mockReturnValue(
        Promise.resolve(user),
      );

      expect(await loginUseCases.validateLoginJwt('username')).toEqual(user);
    });
  });

  describe('logout', () => {
    it('should return an array to invalid the cookie', async () => {
      expect(await logoutUseCases.execute()).toEqual([
        'auth-cookie=; Path=/; HttpOnly',
      ]);
    });
  });
});
