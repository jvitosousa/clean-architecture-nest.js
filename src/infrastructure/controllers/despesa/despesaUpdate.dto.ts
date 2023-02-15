import { PickType } from '@nestjs/mapped-types';
import { DespesaDto } from './despesa.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class UpdateDespesaDto extends PickType(DespesaDto, [
  'descricao',
  'valor',
] as const) {
  @ApiProperty({ required: true, type: 'number' })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  id: number;
}
