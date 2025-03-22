import { validate } from 'class-validator';
import { SavePushTokenDto } from '../notifications.dto';

describe('SavePushTokenDto', () => {
  it('should pass validation with a valid userId and token', async () => {
    const dto = new SavePushTokenDto();
    dto.userId = '123e4567-e33b-12d3-a456-426614174000';
    dto.token = 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation if userId is not a valid UUID', async () => {
    const dto = new SavePushTokenDto();
    dto.userId = 'invalid-uuid';
    dto.token = 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });

  it('should fail validation if token is an empty string', async () => {
    const dto = new SavePushTokenDto();
    dto.userId = '123e4567-e34b-12d3-a456-426614174000';
    dto.token = '';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail validation if token is not a string', async () => {
    const dto = new SavePushTokenDto();
    dto.userId = '123e4567-e34b-12d3-a456-426614174000';
    dto.token = 12345 as unknown as string;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isString');
  });
});
