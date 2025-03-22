import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ChatDto } from '../mindify-ai.dto';

describe('ChatDto Validation Tests', () => {
  it('should validate a valid ChatDto instance', async () => {
    const input = {
      created_at: '2021-09-01T00:00:00.000Z',
      id: 1,
      summary_id: 1,
      user_id: '123e4567-e34b-12d3-a456-426614174000',
    };
    const dto = plainToInstance(ChatDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should return validation errors for invalid ChatDto input', async () => {
    const input = {
      created_at: 12345,
      id: 'invalid-id',
      summary_id: 'not-a-number',
      user_id: 'invalid-uuid',
    };
    const dto = plainToInstance(ChatDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should validate a ChatDto instance with optional fields missing', async () => {
    const input = {
      created_at: '2021-09-01T00:00:00.000Z',
      id: 1,
      user_id: '123e4567-e34b-12d3-a456-426614174000',
    };
    const dto = plainToInstance(ChatDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should return validation errors for missing required fields in ChatDto', async () => {
    const input = {
      summary_id: 1,
      user_id: '123e4567-e34b-12d3-a456-426614174000',
    };
    const dto = plainToInstance(ChatDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
