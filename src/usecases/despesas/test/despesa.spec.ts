import { InterfaceAws } from '../../../domain/adapters/aws.interface';
import { ILogger } from '../../../domain/logger/logger.interface';
import { DespesasModel } from '../../../domain/model/despesas.model';
import { DespesaRepository } from '../../../domain/repository/despesas.repository.interface';
import { CreateDespesaUseCases } from '../createDespesa.usecase';
import { GetDespesaUseCase } from '../getDespesa.usecase';
import { GetDespesasUseCase } from '../getDespesas.usecase';
import { UpdateDespesaUsecase } from '../updateDespesa.usecase';
import { DeleteDespesaUsecase } from '../deleteDespesa.usecase';

describe('uses_cases/despesas', () => {
  let iAws: InterfaceAws;
  let logger: ILogger;
  let despesaRepository: DespesaRepository;
  let createDespesaUseCases: CreateDespesaUseCases;
  let getDespesaUseCases: GetDespesaUseCase;
  let getDespesasUseCases: GetDespesasUseCase;
  let updateDespesaUseCases: UpdateDespesaUsecase;
  let deleteDespesaUseCases: DeleteDespesaUsecase;

  beforeEach(() => {
    iAws = {} as InterfaceAws;
    iAws.sendEmail = jest.fn();

    logger = {} as ILogger;
    logger.log = jest.fn();

    despesaRepository = {} as DespesaRepository;
    despesaRepository.insert = jest.fn();
    despesaRepository.updateContent = jest.fn();
    despesaRepository.deleteByDescricao = jest.fn();
    despesaRepository.findAll = jest.fn();
    despesaRepository.findByDescricao = jest.fn();
    despesaRepository.getUserDespesa = jest.fn();

    createDespesaUseCases = new CreateDespesaUseCases(
      despesaRepository,
      logger,
      iAws,
    );

    getDespesaUseCases = new GetDespesaUseCase(despesaRepository, logger);

    getDespesasUseCases = new GetDespesasUseCase(despesaRepository, logger);

    updateDespesaUseCases = new UpdateDespesaUsecase(despesaRepository, logger);

    deleteDespesaUseCases = new DeleteDespesaUsecase(despesaRepository, logger);
  });

  describe('despesa usecases', () => {
    it('should create a despesa successfully', async () => {
      const despesa: DespesasModel = {
        id: 1,
        descricao: 'despesa',
        valor: 100,
        data: new Date(),
        userId: 1,
        createdDate: undefined,
        updatedDate: undefined,
      };
      (despesaRepository.insert as jest.Mock).mockReturnValue(despesa);
      (logger.log as jest.Mock).mockReturnValue('Despesa created');
      (iAws.sendEmail as jest.Mock).mockReturnValue('Email sent');
      expect(
        await createDespesaUseCases.execute(
          despesa.valor,
          despesa.data,
          despesa.descricao,
          despesa.userId,
          'teste@email.com',
        ),
      ).toEqual(despesa);
    });
    it('should get a despesa successfully', async () => {
      const despesa: DespesasModel = {
        id: 1,
        descricao: 'despesa',
        valor: 100,
        data: new Date(),
        userId: 1,
        createdDate: undefined,
        updatedDate: undefined,
      };
      (despesaRepository.findByDescricao as jest.Mock).mockReturnValue(despesa);
      (logger.log as jest.Mock).mockReturnValue('Despesa created');
      (iAws.sendEmail as jest.Mock).mockReturnValue('Email sent');
      expect(await getDespesaUseCases.execute(despesa.descricao, 2)).toEqual(
        despesa,
      );
    });

    it('should get despesas successfully', async () => {
      const despesa: DespesasModel = {
        id: 1,
        descricao: 'despesa',
        valor: 100,
        data: new Date(),
        userId: 1,
        createdDate: undefined,
        updatedDate: undefined,
      };
      (despesaRepository.findAll as jest.Mock).mockReturnValue([despesa]);
      (logger.log as jest.Mock).mockReturnValue('Despesa created');
      (iAws.sendEmail as jest.Mock).mockReturnValue('Email sent');
      expect(await getDespesasUseCases.execute(2)).toEqual([despesa]);
    });

    it('should update a despesa successfully', async () => {
      const despesa: DespesasModel = {
        id: 1,
        descricao: 'despesa',
        valor: 100,
        data: new Date(),
        userId: 1,
        createdDate: undefined,
        updatedDate: undefined,
      };
      (despesaRepository.updateContent as jest.Mock).mockReturnValue(
        Promise<void>,
      );
      (logger.log as jest.Mock).mockReturnValue('Despesa updated');
      expect(
        await updateDespesaUseCases.execute(
          despesa.valor,
          despesa.descricao,
          despesa.id,
          despesa.userId,
        ),
      ).toEqual(undefined);
    });

    it('should update a despesa successfully', async () => {
      const despesa: DespesasModel = {
        id: 1,
        descricao: 'despesa',
        valor: 100,
        data: new Date(),
        userId: 1,
        createdDate: undefined,
        updatedDate: undefined,
      };
      (despesaRepository.deleteByDescricao as jest.Mock).mockReturnValue(
        Promise<void>,
      );
      (logger.log as jest.Mock).mockReturnValue('Despesa deleted');
      expect(
        await deleteDespesaUseCases.execute(despesa.descricao, despesa.userId),
      ).toEqual(undefined);
    });
  });
});
