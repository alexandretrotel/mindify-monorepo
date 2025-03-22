import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { mockNotificationsService } from 'src/common/__mocks__/notifications.service';

describe('NotificationsController', () => {
  let notificationsController: NotificationsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
        },
      ],
    }).compile();

    notificationsController = app.get<NotificationsController>(
      NotificationsController,
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getNotifications', () => {
    it('should return an array of notifications', async () => {
      const result = [
        {
          id: '1',
          title: 'Notification 1',
          message: 'This is a notification',
          is_read: false,
          created_at: new Date().toISOString(),
        },
      ];

      mockNotificationsService.getNotifications.mockResolvedValueOnce(result);

      expect(await notificationsController.getNotifications()).toBe(result);
    });

    it('should throw an error if an error occurs', async () => {
      mockNotificationsService.getNotifications.mockRejectedValueOnce(
        new Error('An error occurred while fetching notifications'),
      );

      await expect(notificationsController.getNotifications()).rejects.toThrow(
        'An error occurred while fetching notifications',
      );
    });
  });

  describe('markAllNotificationsAsRead', () => {
    it('should mark all notifications as read', async () => {
      const result = { success: true };

      mockNotificationsService.markAllNotificationsAsRead.mockResolvedValueOnce(
        result,
      );

      expect(
        await notificationsController.markAllNotificationsAsRead({
          userId: '1',
        }),
      ).toBe(result);
    });

    it('should throw an error if an error occurs', async () => {
      mockNotificationsService.markAllNotificationsAsRead.mockRejectedValueOnce(
        new Error('An error occurred while updating notifications'),
      );

      await expect(
        notificationsController.markAllNotificationsAsRead({ userId: '1' }),
      ).rejects.toThrow('An error occurred while updating notifications');
    });
  });

  describe('deleteAllNotifications', () => {
    it('should delete all notifications', async () => {
      const result = { success: true };

      mockNotificationsService.deleteAllNotifications.mockResolvedValueOnce(
        result,
      );

      expect(
        await notificationsController.deleteAllNotifications({ userId: '1' }),
      ).toBe(result);
    });

    it('should throw an error if an error occurs', async () => {
      mockNotificationsService.deleteAllNotifications.mockRejectedValueOnce(
        new Error('An error occurred while deleting notifications'),
      );

      await expect(
        notificationsController.deleteAllNotifications({ userId: '1' }),
      ).rejects.toThrow('An error occurred while deleting notifications');
    });
  });

  describe('saveTokenForUser', () => {
    it('should save the token for the user', async () => {
      const result = { success: true };

      mockNotificationsService.saveTokenForUser.mockResolvedValueOnce(result);

      expect(
        await notificationsController.saveTokenForUser({
          userId: '1',
          token: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]',
        }),
      ).toBe(result);
    });

    it('should throw an error if an error occurs', async () => {
      mockNotificationsService.saveTokenForUser.mockRejectedValueOnce(
        new Error('An error occurred while saving the token'),
      );

      await expect(
        notificationsController.saveTokenForUser({
          userId: '1',
          token: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]',
        }),
      ).rejects.toThrow('An error occurred while saving the token');
    });
  });
});
