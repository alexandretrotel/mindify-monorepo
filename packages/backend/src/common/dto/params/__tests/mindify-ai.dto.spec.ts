import { validate } from 'class-validator';
import { DeleteAllMessagesDto } from '../mindify-ai.dto';

describe('DeleteAllMessagesDto', () => {
  it('should validate successfully with a valid UUID for userId and integer for chatId', async () => {
    const dto = new DeleteAllMessagesDto();
    dto.userId = '123e4567-e33b-12d3-a456-426614174000';
    dto.chatId = 1;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation if userId is not a valid UUID', async () => {
    const dto = new DeleteAllMessagesDto();
    dto.userId = 'invalid-uuid';
    dto.chatId = 1;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });

  it('should fail validation if chatId is not an integer', async () => {
    const dto = new DeleteAllMessagesDto();
    dto.userId = '123e4567-e43b-12d3-a456-426614174000';
    dto.chatId = 'not-an-integer' as unknown as number;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isInt');
  });

  it('should fail validation if userId is missing', async () => {
    const dto = new DeleteAllMessagesDto();
    dto.chatId = 1;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });

  it('should fail validation if chatId is missing', async () => {
    const dto = new DeleteAllMessagesDto();
    dto.userId = '123e4567-e34b-12d3-a456-426614174000';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isInt');
  });
});
