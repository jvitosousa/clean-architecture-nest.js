import { Test } from '@nestjs/testing';
import {
  ExecutionContext,
  INestApplication,
  UnauthorizedException,
} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { LoginUseCase } from './../src/usecases/auth/login.usecase';
import { GetUserUseCases } from './../src/usecases/user/getUser.usecases';
import { DeleteUserUsecase } from './../src/usecases/user/deleteUser.usecases';
import { CreateUserUseCases } from './../src/usecases/user/createUser.usecases';
import { CreateDespesaUseCases } from './../src/usecases/despesas/createDespesa.usecase';
import { GetDespesaUseCase } from './../src/usecases/despesas/getDespesa.usecase';
import { GetDespesasUseCase } from './../src/usecases/despesas/getDespesas.usecase';
import { DeleteDespesaUsecase } from './../src/usecases/despesas/deleteDespesa.usecase';
import { UpdateDespesaUsecase } from './../src/usecases/despesas/updateDespesa.usecase';
import { UseCaseProxy } from './../src/infrastructure/usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from './../src/infrastructure/usecases-proxy/usecases-proxy.module';
import { JwtGuard } from './../src/infrastructure/common/guard/jwt.guard';
import { UserPresenter } from 'src/infrastructure/controllers/user/user.presenter';
import * as cookieParser from 'cookie-parser';
import * as moment from 'moment';
import { DespesaPresenter } from 'src/infrastructure/controllers/despesa/despesa.presenter';

describe('=========infrastructure/controllers/auth=========', () => {
  let app: INestApplication;
  let loginUseCase: LoginUseCase;
  let getUserUseCase: GetUserUseCases;
  let deleteUserUseCase: DeleteUserUsecase;
  let createUserUseCase: CreateUserUseCases;
  let createDespesaUseCase: CreateDespesaUseCases;
  let getDespesaUseCase: GetDespesaUseCase;
  let getDespesasUseCase: GetDespesasUseCase;
  let deleteDespesaUseCase: DeleteDespesaUsecase;
  let updateDespesaUseCase: UpdateDespesaUsecase;

  beforeAll(async () => {
    loginUseCase = {} as LoginUseCase;
    loginUseCase.getCookieJwt = jest.fn();
    loginUseCase.validateLogin = jest.fn();
    loginUseCase.validateLoginJwt = jest.fn();

    getUserUseCase = {} as GetUserUseCases;
    getUserUseCase.execute = jest.fn();

    deleteUserUseCase = {} as DeleteUserUsecase;
    deleteUserUseCase.execute = jest.fn();

    createUserUseCase = {} as CreateUserUseCases;
    createUserUseCase.execute = jest.fn();

    createDespesaUseCase = {} as CreateDespesaUseCases;
    createDespesaUseCase.execute = jest.fn();

    getDespesaUseCase = {} as GetDespesaUseCase;
    getDespesaUseCase.execute = jest.fn();

    getDespesasUseCase = {} as GetDespesasUseCase;
    getDespesasUseCase.execute = jest.fn();

    deleteDespesaUseCase = {} as DeleteDespesaUsecase;
    deleteDespesaUseCase.execute = jest.fn();

    updateDespesaUseCase = {} as UpdateDespesaUsecase;
    updateDespesaUseCase.execute = jest.fn();

    const loginUsecaseProxyService: UseCaseProxy<LoginUseCase> = {
      getInstance: () => loginUseCase,
    } as UseCaseProxy<LoginUseCase>;

    const getUserUsecaseProxyService: UseCaseProxy<GetUserUseCases> = {
      getInstance: () => getUserUseCase,
    } as UseCaseProxy<GetUserUseCases>;

    const deleteUserUsecaseProxyService: UseCaseProxy<DeleteUserUsecase> = {
      getInstance: () => deleteUserUseCase,
    } as UseCaseProxy<DeleteUserUsecase>;

    const createUserUsecaseProxyService: UseCaseProxy<CreateUserUseCases> = {
      getInstance: () => createUserUseCase,
    } as UseCaseProxy<CreateUserUseCases>;

    const createDespesaUsecaseProxyService: UseCaseProxy<CreateDespesaUseCases> =
      {
        getInstance: () => createDespesaUseCase,
      } as UseCaseProxy<CreateDespesaUseCases>;

    const getDespesaUsecaseProxyService: UseCaseProxy<GetDespesaUseCase> = {
      getInstance: () => getDespesaUseCase,
    } as UseCaseProxy<GetDespesaUseCase>;

    const getDespesasUsecaseProxyService: UseCaseProxy<GetDespesasUseCase> = {
      getInstance: () => getDespesasUseCase,
    } as UseCaseProxy<GetDespesasUseCase>;

    const deleteDespesaUsecaseProxyService: UseCaseProxy<DeleteDespesaUsecase> =
      {
        getInstance: () => deleteDespesaUseCase,
      } as UseCaseProxy<DeleteDespesaUsecase>;

    const updateDespesaUsecaseProxyService: UseCaseProxy<UpdateDespesaUsecase> =
      {
        getInstance: () => updateDespesaUseCase,
      } as UseCaseProxy<UpdateDespesaUsecase>;

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UsecasesProxyModule.LOGIN_USECASES_PROXY)
      .useValue(loginUsecaseProxyService)
      .overrideProvider(UsecasesProxyModule.GET_USER_USECASES_PROXY)
      .useValue(getUserUsecaseProxyService)
      .overrideProvider(UsecasesProxyModule.DELETE_USER_USECASES_PROXY)
      .useValue(deleteUserUsecaseProxyService)
      .overrideProvider(UsecasesProxyModule.POST_USER_USECASES_PROXY)
      .useValue(createUserUsecaseProxyService)
      .overrideProvider(UsecasesProxyModule.POST_DESPESA_USECASES_PROXY)
      .useValue(createDespesaUsecaseProxyService)
      .overrideProvider(UsecasesProxyModule.GET_DESPESA_USECASES_PROXY)
      .useValue(getDespesaUsecaseProxyService)
      .overrideProvider(UsecasesProxyModule.GET_DESPESAS_USECASES_PROXY)
      .useValue(getDespesasUsecaseProxyService)
      .overrideProvider(UsecasesProxyModule.DELETE_DESPESA_USECASES_PROXY)
      .useValue(deleteDespesaUsecaseProxyService)
      .overrideProvider(UsecasesProxyModule.UPDATE_DESPESA_USECASES_PROXY)
      .useValue(updateDespesaUsecaseProxyService)
      .overrideGuard(JwtGuard)
      .useValue({
        canActivate(context: ExecutionContext) {
          const req = context.switchToHttp().getRequest();
          req.user = { email: 'email' };
          const valid = req?.cookies['auth-cookie'] === '12345678910';
          if (!valid) {
            throw new UnauthorizedException();
          }
          return valid;
        },
      })
      .compile();

    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    await app.init();
  });

  it(`/ (POST) login should return 401`, async () => {
    (loginUseCase.validateLogin as jest.Mock).mockReturnValue(
      Promise.resolve(null),
    );

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'userEmail', password: 'password' })
      .expect(401);
  });

  it('/ (POST) login auth with success', async () => {
    (loginUseCase.validateLogin as jest.Mock).mockReturnValue(
      Promise.resolve({
        id: 1,
        name: 'name',
        email: 'email',
      }),
    );
    (loginUseCase.getCookieJwt as jest.Mock).mockReturnValue(
      Promise.resolve('12345678910'),
    );
    const result = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'email', password: 'password' })
      .expect(201);

    expect(result.headers['set-cookie']).toEqual([
      `auth-cookie=12345678910; Path=/; HttpOnly`,
    ]);
  });

  it(`/ (POST) logout should return 201`, async () => {
    const result = await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Cookie', ['auth-cookie=12345678910; Path=/; HttpOnly'])
      .send()
      .expect(201);

    expect(result.headers['set-cookie']).toEqual([
      'auth-cookie=; Path=/; HttpOnly',
    ]);
  });

  describe('=========infrastructure/controllers/user=========', () => {
    it(`/ (GET) user should return 200`, async () => {
      const data = new Date();
      const user: UserPresenter = {
        name: 'name',
        email: 'email',
        createdate: moment(data).format('YYYY-MM-DD HH:mm'),
      };
      const userModel = {
        id: 1,
        name: 'name',
        email: 'email',
        createdate: data,
      };
      (getUserUseCase.execute as jest.Mock).mockReturnValue(
        Promise.resolve(userModel),
      );
      const result = await request(app.getHttpServer())
        .get('/user')
        .query({ name: 'name' })
        .set('Cookie', ['auth-cookie=12345678910; Path=/; HttpOnly'])
        .expect(200);

      expect(result.body).toEqual(user);
    });

    it(`/ (DELETE) user should return 200`, async () => {
      (deleteUserUseCase.execute as jest.Mock).mockReturnValue(
        Promise.resolve(),
      );
      const result = await request(app.getHttpServer())
        .delete('/user')
        .set('Cookie', ['auth-cookie=12345678910; Path=/; HttpOnly'])
        .set({ user: { id: 1 } })
        .expect(200);

      expect(result.body).toEqual({ message: 'User deleted' });
    });

    it(`/ (POST) user should return 201`, async () => {
      const data = new Date();
      const user: UserPresenter = {
        name: 'name',
        email: 'email@email.com',
        createdate: moment(data).format('YYYY-MM-DD HH:mm'),
      };
      const userModel = {
        id: 1,
        name: 'name',
        email: 'email@email.com',
        createdate: data,
      };
      (createUserUseCase.execute as jest.Mock).mockReturnValue(
        Promise.resolve(userModel),
      );
      const result = await request(app.getHttpServer())
        .post('/user')
        .send({
          name: 'name',
          email: 'email@email.com',
          password: 'password',
        })
        .expect(201);

      expect(result.body).toEqual(user);
    });
  });

  describe('=========infrastructure/controllers/despesa=========', () => {
    it(`/ (POST) despesa should return 201`, async () => {
      const data = new Date();
      const despesamModel = {
        id: 1,
        descricao: 'randomdesc',
        valor: 1000000,
        data: new Date(
          moment('21/11/2002', 'DD MM YYYY hh:mm:ss').toISOString(),
        ),
        createdDate: data,
      };
      (createDespesaUseCase.execute as jest.Mock).mockReturnValue(
        Promise.resolve(despesamModel),
      );
      const despesa: DespesaPresenter = {
        descricao: 'randomdesc',
        valor: 1000000,
        data: moment(despesamModel.data).format('YYYY-MM-DD HH:mm'),
        createdate: moment(data).format('YYYY-MM-DD HH:mm'),
      };
      const result = await request(app.getHttpServer())
        .post('/despesa')
        .set('Cookie', ['auth-cookie=12345678910; Path=/; HttpOnly'])
        .set({ user: { id: 1, email: 'email' } })
        .send({
          descricao: 'randomdesc',
          valor: 1000000,
          data: '21/11/2002',
        })
        .expect(201);

      expect(result.body).toEqual(despesa);
    });

    it(`/ (GET) despesa with success`, async () => {
      const data = new Date();
      const despesamModel = {
        id: 1,
        descricao: 'randomdesc',
        valor: 1000000,
        data: new Date(
          moment('21/11/2002', 'DD MM YYYY hh:mm:ss').toISOString(),
        ),
        createdDate: data,
      };
      (getDespesaUseCase.execute as jest.Mock).mockReturnValue(
        Promise.resolve(despesamModel),
      );
      const despesa: DespesaPresenter = {
        descricao: 'randomdesc',
        valor: 1000000,
        data: moment(despesamModel.data).format('YYYY-MM-DD HH:mm'),
        createdate: moment(data).format('YYYY-MM-DD HH:mm'),
      };
      const result = await request(app.getHttpServer())
        .get('/despesa')
        .set('Cookie', ['auth-cookie=12345678910; Path=/; HttpOnly'])
        .set({ user: { id: 1, email: 'email' } })
        .expect(200);

      expect(result.body).toEqual(despesa);
    });

    it(`/all (GET) despesa with success`, async () => {
      const data = new Date();
      const despesamModel = {
        id: 1,
        descricao: 'randomdesc',
        valor: 1000000,
        data: new Date(
          moment('21/11/2002', 'DD MM YYYY hh:mm:ss').toISOString(),
        ),
        createdDate: data,
      };
      (getDespesasUseCase.execute as jest.Mock).mockReturnValue(
        Promise.resolve([despesamModel]),
      );
      const despesa: DespesaPresenter = {
        descricao: 'randomdesc',
        valor: 1000000,
        data: moment(despesamModel.data).format('YYYY-MM-DD HH:mm'),
        createdate: moment(data).format('YYYY-MM-DD HH:mm'),
      };
      const result = await request(app.getHttpServer())
        .get('/despesa/all')
        .set('Cookie', ['auth-cookie=12345678910; Path=/; HttpOnly'])
        .set({ user: { id: 1, email: 'email' } })
        .expect(200);

      expect(result.body).toEqual([despesa]);
    });

    it(`/ (DELETE) despesa should return 200`, async () => {
      (deleteDespesaUseCase.execute as jest.Mock).mockReturnValue(
        Promise.resolve(),
      );

      const result = await request(app.getHttpServer())
        .delete('/despesa')
        .query({ descricao: 'randomdesc' })
        .set('Cookie', ['auth-cookie=12345678910; Path=/; HttpOnly'])
        .set({ user: { id: 1, email: 'email' } })
        .expect(200);

      expect(result.body).toEqual({ message: 'Despesa deleted with success' });
    });

    it(`/ (PUT) despesa should return 201`, async () => {
      (updateDespesaUseCase.execute as jest.Mock).mockReturnValue(
        Promise.resolve(),
      );
      const result = await request(app.getHttpServer())
        .put('/despesa')
        .set('Cookie', ['auth-cookie=12345678910; Path=/; HttpOnly'])
        .set({ user: { id: 1, email: 'email' } })
        .send({
          id: 1,
          descricao: 'randomdesc',
          valor: 1000000,
        })
        .expect(200);

      expect(result.body).toEqual({ message: 'Despesa updated with success' });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
