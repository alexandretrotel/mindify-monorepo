import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';
import { Card } from 'ts-fsrs';

export class CardDto {
  @IsObject()
  @ApiProperty({
    description: 'The card',
    example: {
      id: '123e4567-e456-12d3-a456-426614174000',
      title: 'Card 1',
      description: 'A card',
      image: 'https://example.com/image.png',
    },
  })
  card: Card;
}
