import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NotificationDto } from '../notification.dto';

describe('NotificationDto Validation Tests', () => {
  it('should validate a valid NotificationDto instance', async () => {
    const input = {
      id: 1,
      title: 'This is a notification title',
      message: 'This is a notification message',
      type: 'friend_request',
      user_id: '123e4567-e34b-12d3-a456-426614174000',
      is_read: false,
      data: { key: 'value' },
    };
    const dto = plainToInstance(NotificationDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should return validation errors for invalid NotificationDto input', async () => {
    const input = {
      id: 'invalid-id',
      title: 12345,
      message: null,
      type: false,
      user_id: 'invalid-uuid',
      is_read: 'not-a-boolean',
      data: 'not-an-object',
    };
    const dto = plainToInstance(NotificationDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should validate a NotificationDto instance with optional fields missing', async () => {
    const input = {
      id: 1,
      title: 'This is a notification title',
      message: 'This is a notification message',
      type: 'friend_request',
      user_id: '123e4567-e34b-12d3-a456-426614174000',
      is_read: false,
    };
    const dto = plainToInstance(NotificationDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should return validation errors for missing required fields in NotificationDto', async () => {
    const input = {
      title: 'This is a notification title',
      user_id: '123e4567-e34b-12d3-a456-426614174000',
    };
    const dto = plainToInstance(NotificationDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
