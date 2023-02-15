import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class UserDto {
  @ApiProperty({ required: true, type: 'string' })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  readonly name: string;
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
