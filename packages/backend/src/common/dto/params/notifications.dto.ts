import { IsString, IsNotEmpty } from 'class-validator';
import { UserIdDto } from './user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SavePushTokenDto extends UserIdDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The push token',
    example: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]',
  })
  token: string;
}
