import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  MaxLength,
  IsPositive,
} from 'class-validator';
import { IsDataValida } from '../../common/validates/DataValida';
import { Transform } from 'class-transformer';
import * as moment from 'moment';

export class DespesaDto {
  @ApiProperty({ required: true, type: 'string' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(191)
  readonly descricao: string;

  @ApiProperty({ required: true, type: 'number' })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly valor: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @Transform(({ value }) => moment(value, 'DD MM YYYY hh:mm:ss').toISOString())
  @IsDataValida({ message: 'Data inválida' })
  readonly data: string;
}
