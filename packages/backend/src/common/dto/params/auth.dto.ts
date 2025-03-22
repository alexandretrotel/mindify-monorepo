import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsNumberString()
  @MinLength(8, {
    message: 'Password must be at least 8 characters long',
  })
  @ApiProperty({
    description: 'The user password',
    example: 'password',
  })
  newPassword: string;

  @IsString()
  @MinLength(8, {
    message: 'Password must be at least 8 characters long',
  })
  @ApiProperty({
    description: 'The user password confirmation',
    example: 'password',
  })
  confirmPassword: string;
}
