import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { mockNotificationService } from 'src/common/__mocks__/notification.service';
import {
  NotificationBatchDto,
  NotificationDto,
} from '../common/dto/params/notification.dto';

describe('NotificationController', () => {
  let notificationController: NotificationController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
      ],
    }).compile();

    notificationController = app.get<NotificationController>(
      NotificationController,
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('markNotificationAsRead', () => {
    const notificationId = 3;

    it('should call notificationService.markNotificationAsRead with correct arguments', async () => {
      await notificationController.markNotificationAsRead({ notificationId });

      expect(
        mockNotificationService.markNotificationAsRead,
      ).toHaveBeenCalledWith(notificationId);
      expect(
        mockNotificationService.markNotificationAsRead,
      ).toHaveBeenCalledTimes(1);
    });

    it('should return the result of notificationService.markNotificationAsRead', async () => {
      const result = await notificationController.markNotificationAsRead({
        notificationId,
      });

      expect(result).toEqual(
        mockNotificationService.markNotificationAsRead(notificationId),
      );
    });
  });

  describe('markNotificationAsUnread', () => {
    const notificationId = 3;

    it('should call notificationService.markNotificationAsUnread with correct arguments', async () => {
      await notificationController.markNotificationAsUnread({ notificationId });

      expect(
        mockNotificationService.markNotificationAsUnread,
      ).toHaveBeenCalledWith(notificationId);
      expect(
        mockNotificationService.markNotificationAsUnread,
      ).toHaveBeenCalledTimes(1);
    });

    it('should return the result of notificationService.markNotificationAsUnread', async () => {
      const result = await notificationController.markNotificationAsUnread({
        notificationId,
      });

      expect(result).toEqual(
        mockNotificationService.markNotificationAsUnread(notificationId),
      );
    });
  });

  describe('deleteNotification', () => {
    const notificationId = 3;

    it('should call notificationService.deleteNotification with correct arguments', async () => {
      await notificationController.deleteNotification({ notificationId });

      expect(mockNotificationService.deleteNotification).toHaveBeenCalledWith(
        notificationId,
      );
      expect(mockNotificationService.deleteNotification).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should return the result of notificationService.deleteNotification', async () => {
      const result = await notificationController.deleteNotification({
        notificationId,
      });

      expect(result).toEqual(
        mockNotificationService.deleteNotification(notificationId),
      );
    });
  });

  describe('storeNotification', () => {
    const notificationDto: NotificationDto = {
      userId: 'user1',
      title: 'title',
      message: 'message',
      type: 'friend_request',
      data: { friend_id: 'user1' },
    };

    it('should call notificationService.storeNotification with correct arguments', async () => {
      await notificationController.storeNotification(notificationDto);

      expect(mockNotificationService.storeNotification).toHaveBeenCalledWith(
        notificationDto.userId,
        notificationDto.title,
        notificationDto.message,
        notificationDto.type,
        notificationDto.data,
      );
      expect(mockNotificationService.storeNotification).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should return the result of notificationService.storeNotification', async () => {
      const result =
        await notificationController.storeNotification(notificationDto);

      expect(result).toEqual(
        mockNotificationService.storeNotification(
          notificationDto.userId,
          notificationDto.title,
          notificationDto.message,
          notificationDto.type,
          notificationDto.data,
        ),
      );
    });
  });

  describe('sendNotification', () => {
    const notificationBatchDto: NotificationBatchDto = {
      userId: 'user1',
      title: 'title',
      message: 'message',
      type: 'friend_request',
      data: { friend_id: 'user1' },
      batch: 5,
    };

    it('should call notificationService.sendNotification with correct arguments', async () => {
      await notificationController.sendNotification(notificationBatchDto);

      expect(mockNotificationService.sendNotification).toHaveBeenCalledWith(
        notificationBatchDto.userId,
        notificationBatchDto.title,
        notificationBatchDto.message,
        notificationBatchDto.type,
        notificationBatchDto.data,
        notificationBatchDto.batch,
      );
      expect(mockNotificationService.sendNotification).toHaveBeenCalledTimes(1);
    });

    it('should return the result of notificationService.sendNotification', async () => {
      const result =
        await notificationController.sendNotification(notificationBatchDto);

      expect(result).toEqual(
        mockNotificationService.sendNotification(
          notificationBatchDto.userId,
          notificationBatchDto.title,
          notificationBatchDto.message,
          notificationBatchDto.type,
          notificationBatchDto.data,
          notificationBatchDto.batch,
        ),
      );
    });
  });
});
