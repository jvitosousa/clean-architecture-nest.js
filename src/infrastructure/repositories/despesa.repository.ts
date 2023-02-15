import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DespesasModel } from '../..//domain/model/despesas.model';
import { UserModel } from '../../domain/model/user.model';
import { DespesaRepository } from '../../domain/repository/despesas.repository.interface';
import { Repository } from 'typeorm';
import { Despesa } from '../entities/despesa.entity';
import { LoggerService } from '../logger/logger.service';
import { DataBaseUserRepository } from './user.repository';

@Injectable()
export class DataBaseDespesaRepository implements DespesaRepository {
  constructor(
    @InjectRepository(Despesa)
    private readonly despesaRepository: Repository<Despesa>,
    @Inject(DataBaseUserRepository)
    private readonly userRepositoryDataBase: DataBaseUserRepository,
    @Inject(LoggerService)
    private readonly loggerService: LoggerService,
  ) {}
  async getUserDespesa(despesaId: number): Promise<UserModel> {
    try {
      const despesa = await this.despesaRepository
        .createQueryBuilder('despesa')
        .leftJoinAndSelect('despesa.user', 'user')
        .where('despesa.id = :id', { id: despesaId })
        .getOne();
      if (!despesa) this.loggerService.error('Get user despesa', 'not found');
      return this.userRepositoryDataBase.toUserModel(despesa.user);
    } catch (error) {
      this.loggerService.error(error.message, error.stack);
      throw new Error(error);
    }
  }
  async insert(user: DespesasModel): Promise<DespesasModel> {
    try {
      const despesaEntity = await this.toDespesaEntity(user);
      const result = await this.despesaRepository.insert(despesaEntity);
      return this.toDespesaModel(result.generatedMaps[0] as Despesa);
    } catch (error) {
      this.loggerService.error(error.message, error.stack);
      throw new Error(error);
    }
  }
  async findAll(userId: number): Promise<DespesasModel[]> {
    try {
      const despesas = await this.despesaRepository
        .createQueryBuilder('despesa')
        .leftJoinAndSelect('despesa.user', 'user')
        .where('despesa.userId = :id', { id: userId })
        .getMany();
      if (!despesas) this.loggerService.error('Get all despesas', 'not found');
      return Promise.all(
        despesas.map((despesa) => this.toDespesaModel(despesa)),
      );
    } catch (error) {
      this.loggerService.error(error.message, error.stack);
      throw new Error(error);
    }
  }
  async findByDescricao(
    descricao: string,
    userId: number,
  ): Promise<DespesasModel> {
    try {
      const despesa = await this.despesaRepository
        .createQueryBuilder('despesa')
        .select('*')
        .where('despesa.descricao = :descricao', { descricao })
        .andWhere('despesa.userId = :userId', { userId })
        .getRawOne();
      if (!despesa)
        this.loggerService.error('Get despesa by descricao', 'not found');
      return this.toDespesaModel(despesa);
    } catch (error) {
      this.loggerService.error(error.message, error.stack);
      throw new Error(error);
    }
  }
  async updateContent(despesa: DespesasModel, userId: number): Promise<void> {
    try {
      const userDespesa = await this.getUserDespesa(despesa.id);
      if (userDespesa.id !== userId) {
        throw new Error('User not authorized');
      }
      await this.despesaRepository.update(despesa.id, { ...despesa });
    } catch (error) {
      this.loggerService.error(error.message, error.stack);
      throw new Error(error);
    }
  }
  async deleteByDescricao(descricao: string, userId: number): Promise<void> {
    try {
      const despesa = await this.findByDescricao(descricao, userId);
      if (despesa.userId !== userId) {
        throw new Error('User not authorized');
      }
      await this.despesaRepository.softDelete({ descricao: descricao });
    } catch (error) {
      this.loggerService.error(error.message, error.stack);
      throw new Error(error);
    }
  }

  private async toDespesaModel(despesa: Despesa): Promise<DespesasModel> {
    const despesaModel: DespesasModel = new DespesasModel();
    const user = await this.getUserDespesa(despesa.id);
    despesaModel.id = despesa.id;
    despesaModel.valor = despesa.valor;
    despesaModel.descricao = despesa.descricao;
    despesaModel.data = despesa.data;
    despesaModel.userId = user.id;
    return despesaModel;
  }

  private async toDespesaEntity(despesaModel: DespesasModel): Promise<Despesa> {
    const despesa: Despesa = new Despesa();
    despesa.id = despesaModel.id;
    despesa.valor = despesaModel.valor;
    despesa.descricao = despesaModel.descricao;
    despesa.data = despesaModel.data;
    despesa.user = await this.userRepositoryDataBase.findById(
      despesaModel.userId,
    );
    return despesa;
  }
}
