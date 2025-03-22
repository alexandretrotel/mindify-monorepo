import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';

export class UserIdDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The user ID',
    example: '123e4567-e3b-12d3-a456-426614174000',
  })
  userId: string;
}

export class UpdateProfileDto {
  @IsString()
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @ApiProperty({
    description: 'The username',
    example: 'username',
  })
  username: string;

  @IsString()
  @MinLength(5, { message: 'Biography must be at least 5 characters long' })
  @ApiProperty({
    description: 'The biography',
    example: 'biography',
  })
  biography: string;
}
