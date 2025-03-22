import { validate } from 'class-validator';
import {
  NotificationIdDto,
  UserNotificationDto,
  NotificationDto,
  NotificationBatchDto,
} from '../notification.dto';
import {
  NotificationType,
  NotificationData,
} from '../../../types/notification';

describe('Notification DTOs', () => {
  describe('NotificationIdDto', () => {
    it('should pass validation with a valid notificationId', async () => {
      const dto = new NotificationIdDto();
      dto.notificationId = 1;

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation if notificationId is not a number', async () => {
      const dto = new NotificationIdDto();
      dto.notificationId = 'not-a-number' as unknown as number;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNumber');
    });
  });

  describe('UserNotificationDto', () => {
    it('should pass validation with a valid UUID for userId and a valid notificationId', async () => {
      const dto = new UserNotificationDto();
      dto.userId = '123e4567-e43b-12d3-a456-426614174000';
      dto.notificationId = 1;

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation if userId is not a valid UUID', async () => {
      const dto = new UserNotificationDto();
      dto.userId = 'invalid-uuid';
      dto.notificationId = 1;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isUuid');
    });
  });

  describe('NotificationDto', () => {
    it('should pass validation with valid userId, title, message, type, and data', async () => {
      const dto = new NotificationDto();
      dto.userId = '123e4567-e43b-12d3-a456-426614174000';
      dto.title = 'notification title';
      dto.message = 'notification message';
      dto.type = 'friend_request' as NotificationType;
      dto.data = {
        friend_id: '123e4567-e34b-12d3-a456-426614174000',
      } as NotificationData;

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation if userId is not a UUID', async () => {
      const dto = new NotificationDto();
      dto.userId = 'not-a-uuid';
      dto.title = 'notification title';
      dto.message = 'notification message';
      dto.type = 'friend_request' as NotificationType;
      dto.data = {
        friend_id: '123e4567-e35b-12d3-a456-426614174000',
      } as NotificationData;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isUuid');
    });

    it('should fail validation if title is empty', async () => {
      const dto = new NotificationDto();
      dto.userId = '123e4567-e33b-12d3-a456-426614174000';
      dto.title = '';
      dto.message = 'notification message';
      dto.type = 'friend_request' as NotificationType;
      dto.data = {
        friend_id: '123e4567-e34b-12d3-a456-426614174000',
      } as NotificationData;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail validation if data is not a non-empty object', async () => {
      const dto = new NotificationDto();
      dto.userId = '123e4567-e35b-12d3-a456-426614174000';
      dto.title = 'notification title';
      dto.message = 'notification message';
      dto.type = 'friend_request' as NotificationType;
      dto.data = {} as NotificationData;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNotEmptyObject');
    });
  });

  describe('NotificationBatchDto', () => {
    it('should pass validation with valid batch, userId, title, message, type, and data', async () => {
      const dto = new NotificationBatchDto();
      dto.userId = '123e4567-e34b-12d3-a456-426614174000';
      dto.title = 'notification title';
      dto.message = 'notification message';
      dto.type = 'friend_request' as NotificationType;
      dto.data = {
        friend_id: '123e4567-e34b-12d3-a456-426614174000',
      } as NotificationData;
      dto.batch = 10;

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation if batch is not a number', async () => {
      const dto = new NotificationBatchDto();
      dto.userId = '123e4567-e33b-12d3-a456-426614174000';
      dto.title = 'notification title';
      dto.message = 'notification message';
      dto.type = 'friend_request' as NotificationType;
      dto.data = {
        friend_id: '123e4567-e33b-12d3-a456-426614174000',
      } as NotificationData;
      dto.batch = 'not-a-number' as unknown as number;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNumber');
    });
  });
});
