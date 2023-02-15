import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class AuthLoginDto {
  @ApiProperty({ required: true })
  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsString()
  readonly email: string;
  @ApiProperty({ required: true, type: 'string' })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  readonly password: string;
}
