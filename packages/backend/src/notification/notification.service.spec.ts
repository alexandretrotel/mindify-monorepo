import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { SupabaseService } from '../common/supabase';
import { ConfigService } from '@nestjs/config';
import { ExpoService } from '../common/expo/expo.service';
import { UserService } from 'src/user/user.service';
import { mockSupabaseService } from 'src/common/__mocks__/supabase';
import {
  NotificationData,
  NotificationType,
} from '../common/types/notification';
import { mockUserService } from 'src/common/__mocks__/user.service';

jest.spyOn(console, 'error').mockImplementation(() => null);

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
        ConfigService,
        ExpoService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('markNotificationAsRead', () => {
    const notificationId = 1;

    const mockMarkNotificationAsReadSuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('notifications')
          .update({ is_read: true }).eq as jest.Mock
      ).mockResolvedValueOnce({
        success: true,
        message: 'Notification marked as read.',
      });

    const mockMarkNotificationAsReadError = () =>
      (
        mockSupabaseService
          .getClient()
          .from('notifications')
          .update({ is_read: true }).eq as jest.Mock
      ).mockResolvedValueOnce({ error: 'error' });

    it('should mark a notification as read', async () => {
      mockMarkNotificationAsReadSuccess();

      const result = await service.markNotificationAsRead(notificationId);

      expect(result).toEqual({
        success: true,
        message: 'Notification marked as read.',
      });
    });

    it("should throw an error if the notification couldn't be marked as read", async () => {
      mockMarkNotificationAsReadError();

      await expect(
        service.markNotificationAsRead(notificationId),
      ).rejects.toThrow('An error occurred while updating the notification.');
    });
  });

  describe('markNotificationAsUnread', () => {
    const notificationId = 1;

    const mockMarkNotificationAsUnreadSuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('notifications')
          .update({ is_read: false }).eq as jest.Mock
      ).mockResolvedValueOnce({
        success: true,
        message: 'Notification marked as unread.',
      });

    const mockMarkNotificationAsUnreadError = () =>
      (
        mockSupabaseService
          .getClient()
          .from('notifications')
          .update({ is_read: false }).eq as jest.Mock
      ).mockResolvedValueOnce({ error: 'error' });

    it('should mark a notification as unread', async () => {
      mockMarkNotificationAsUnreadSuccess();

      const result = await service.markNotificationAsUnread(notificationId);

      expect(result).toEqual({
        success: true,
        message: 'Notification marked as unread.',
      });
    });

    it("should throw an error if the notification couldn't be marked as unread", async () => {
      mockMarkNotificationAsUnreadError();

      await expect(
        service.markNotificationAsUnread(notificationId),
      ).rejects.toThrow('An error occurred while updating the notification.');
    });
  });

  describe('deleteNotification', () => {
    const notificationId = 1;

    const mockDeleteNotificationSuccess = () =>
      (
        mockSupabaseService.getClient().from('notifications').delete()
          .eq as jest.Mock
      ).mockResolvedValueOnce({
        success: true,
        message: 'Notification deleted successfully.',
      });

    const mockDeleteNotificationError = () =>
      (
        mockSupabaseService.getClient().from('notifications').delete()
          .eq as jest.Mock
      ).mockResolvedValueOnce({ error: 'error' });

    it('should delete a notification', async () => {
      mockDeleteNotificationSuccess();

      const result = await service.deleteNotification(notificationId);

      expect(result).toEqual({
        success: true,
        message: 'Notification deleted successfully.',
      });
    });

    it("should throw an error if the notification couldn't be deleted", async () => {
      mockDeleteNotificationError();

      await expect(service.deleteNotification(notificationId)).rejects.toThrow(
        'An error occurred while deleting the notification.',
      );
    });
  });

  describe('storeNotification', () => {
    const userId = '1';
    const title = 'title';
    const message = 'message';
    const type: NotificationType = 'new_summary';
    const data: NotificationData = { deeplink: 'value' };

    const mockStoreNotificationSuccess = () =>
      (
        mockSupabaseService.getClient().from('notifications')
          .insert as jest.Mock
      ).mockResolvedValueOnce({ success: true });

    const mockStoreNotificationError = () =>
      (
        mockSupabaseService.getClient().from('notifications')
          .insert as jest.Mock
      ).mockResolvedValueOnce({ error: 'error' });

    it('should store a notification', async () => {
      mockStoreNotificationSuccess();

      const result = await service.storeNotification(
        userId,
        title,
        message,
        type,
        data,
      );

      expect(result).toEqual({
        success: true,
        message: 'Notification stored successfully.',
      });
    });

    it("should throw an error if the notification couldn't be stored", async () => {
      mockStoreNotificationError();

      await expect(
        service.storeNotification(userId, title, message, type, data),
      ).rejects.toThrow('An error occurred while storing the notification.');
    });
  });

  describe('sendNotification', () => {
    const userId = '1';
    const title = 'title';
    const message = 'message';
    const type: NotificationType = 'new_summary';
    const data: NotificationData = { deeplink: 'value' };

    const mockSendNotificationSuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('notifications')
          .select('*')
          .match({ user_id: userId, type }).gte as jest.Mock
      ).mockResolvedValueOnce({ success: true });

    const mockGetPushTokensSuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('push_notification_tokens')
          .select('expo_push_token').eq as jest.Mock
      ).mockResolvedValueOnce({
        data: [{ expo_push_token: 'expo_push_token' }],
      });

    const mockGetPushTokensError = () =>
      (
        mockSupabaseService
          .getClient()
          .from('push_notification_tokens')
          .select('expo_push_token').eq as jest.Mock
      ).mockResolvedValueOnce({ error: 'error' });

    it('should send notifications', async () => {
      mockSendNotificationSuccess();
      mockGetPushTokensSuccess();

      const result = await service.sendNotification(
        userId,
        title,
        message,
        type,
        data,
      );

      expect(result).toEqual({
        success: true,
        message: 'Notifications sent successfully.',
      });
    });

    it("should throw an error if the user's push tokens couldn't be fetched", async () => {
      mockSendNotificationSuccess();
      mockGetPushTokensError();

      await expect(
        service.sendNotification(userId, title, message, type, data),
      ).rejects.toThrow(
        'An error occurred while fetching the user push notification tokens.',
      );
    });
  });

  describe('notifyFriendRequest', () => {
    const userId = '1';
    const friendId = '2';

    const mockGetUserNameSuccess = () =>
      (mockUserService.getUserMetadata as jest.Mock).mockResolvedValueOnce({
        name: 'name',
      });

    const mockGetUserNameError = () =>
      (mockUserService.getUserMetadata as jest.Mock).mockRejectedValueOnce(
        new Error('An error occurred while fetching the user name.'),
      );

    const mockService = {
      sendNotification: jest.fn(),
    };

    const mockSendNotificationSuccess = () =>
      (mockService.sendNotification as jest.Mock).mockResolvedValueOnce({
        success: true,
        message: 'Notifications sent successfully.',
      });

    it('should notify a friend request', async () => {
      mockGetUserNameSuccess();
      mockSendNotificationSuccess();

      const result = await service.notifyFriendRequest(userId, friendId);

      expect(result).toEqual({
        success: true,
        message: 'Friend request notification sent successfully.',
      });
    });

    it("should throw an error if the user's name couldn't be fetched", async () => {
      mockGetUserNameError();

      await expect(
        service.notifyFriendRequest(userId, friendId),
      ).rejects.toThrow('An error occurred while fetching the user name.');
    });
  });

  describe('notifyFriendRequestAccepted', () => {
    const userId = '1';
    const friendId = '2';

    const mockGetUserNameSuccess = () =>
      (mockUserService.getUserMetadata as jest.Mock).mockResolvedValueOnce({
        name: 'name',
      });

    const mockGetUserNameError = () =>
      (mockUserService.getUserMetadata as jest.Mock).mockRejectedValueOnce(
        new Error('An error occurred while fetching the user name.'),
      );

    const mockService = {
      sendNotification: jest.fn(),
    };

    const mockSendNotificationSuccess = () =>
      (mockService.sendNotification as jest.Mock).mockResolvedValueOnce({
        success: true,
        message: 'Notifications sent successfully.',
      });

    it('should notify a friend request accepted', async () => {
      mockGetUserNameSuccess();
      mockSendNotificationSuccess();

      const result = await service.notifyFriendRequestAccepted(
        userId,
        friendId,
      );

      expect(result).toEqual({
        success: true,
        message: 'Friend request accepted notification sent successfully.',
      });
    });

    it("should throw an error if the user's name couldn't be fetched", async () => {
      mockGetUserNameError();

      await expect(
        service.notifyFriendRequestAccepted(userId, friendId),
      ).rejects.toThrow('An error occurred while fetching the user name.');
    });
  });

  describe('notifyFriendReadSummary', () => {
    const userId = '1';
    const summaryId = 1;
    const summaryTitle = 'title';

    const mockGetFriendIdsSuccess = () =>
      (mockUserService.getFriendIds as jest.Mock).mockResolvedValueOnce({
        friendsIds: ['2'],
      });

    const mockGetFriendIdsError = () =>
      (mockUserService.getFriendIds as jest.Mock).mockRejectedValueOnce(
        new Error('An error occurred while fetching the user friends ids.'),
      );

    const mockGetUserNameSuccess = () =>
      (mockUserService.getUserMetadata as jest.Mock).mockResolvedValueOnce({
        name: 'name',
      });

    const mockGetUserNameError = () =>
      (mockUserService.getUserMetadata as jest.Mock).mockRejectedValueOnce(
        new Error('An error occurred while fetching the user name.'),
      );

    const mockService = {
      sendNotification: jest.fn(),
    };

    const mockSendNotificationSuccess = () =>
      (mockService.sendNotification as jest.Mock).mockResolvedValueOnce({
        success: true,
        message: 'Notifications sent successfully.',
      });

    it('should notify a friend read summary', async () => {
      mockGetFriendIdsSuccess();
      mockGetUserNameSuccess();
      mockSendNotificationSuccess();

      const result = await service.notifyFriendReadSummary(
        userId,
        summaryId,
        summaryTitle,
      );

      expect(result).toEqual({
        success: true,
        message: 'Friend read summary notification sent successfully.',
      });
    });

    it("should throw an error if the user's friends ids couldn't be fetched", async () => {
      mockGetFriendIdsError();

      await expect(
        service.notifyFriendReadSummary(userId, summaryId, summaryTitle),
      ).rejects.toThrow(
        'An error occurred while fetching the user friends ids.',
      );
    });

    it("should throw an error if the user's name couldn't be fetched", async () => {
      mockGetFriendIdsSuccess();
      mockGetUserNameError();

      await expect(
        service.notifyFriendReadSummary(userId, summaryId, summaryTitle),
      ).rejects.toThrow('An error occurred while fetching the user name.');
    });
  });

  describe('notifyFriendSavedSummary', () => {
    const userId = '1';
    const summaryId = 1;
    const summaryTitle = 'title';

    const mockGetFriendIdsSuccess = () =>
      (mockUserService.getFriendIds as jest.Mock).mockResolvedValueOnce({
        friendsIds: ['2'],
      });

    const mockGetFriendIdsError = () =>
      (mockUserService.getFriendIds as jest.Mock).mockRejectedValueOnce(
        new Error('An error occurred while fetching the user friends ids.'),
      );

    const mockGetUserNameSuccess = () =>
      (mockUserService.getUserMetadata as jest.Mock).mockResolvedValueOnce({
        name: 'name',
      });

    const mockGetUserNameError = () =>
      (mockUserService.getUserMetadata as jest.Mock).mockRejectedValueOnce(
        new Error('An error occurred while fetching the user name.'),
      );

    const mockService = {
      sendNotification: jest.fn(),
    };

    const mockSendNotificationSuccess = () =>
      (mockService.sendNotification as jest.Mock).mockResolvedValueOnce({
        success: true,
        message: 'Notifications sent successfully.',
      });

    it('should notify a friend saved summary', async () => {
      mockGetFriendIdsSuccess();
      mockGetUserNameSuccess();
      mockSendNotificationSuccess();

      const result = await service.notifyFriendSavedSummary(
        userId,
        summaryId,
        summaryTitle,
      );

      expect(result).toEqual({
        success: true,
        message: 'Friend saved summary notification sent successfully.',
      });
    });

    it("should throw an error if the user's friends ids couldn't be fetched", async () => {
      mockGetFriendIdsError();

      await expect(
        service.notifyFriendSavedSummary(userId, summaryId, summaryTitle),
      ).rejects.toThrow(
        'An error occurred while fetching the user friends ids.',
      );
    });

    it("should throw an error if the user's name couldn't be fetched", async () => {
      mockGetFriendIdsSuccess();
      mockGetUserNameError();

      await expect(
        service.notifyFriendSavedSummary(userId, summaryId, summaryTitle),
      ).rejects.toThrow('An error occurred while fetching the user name.');
    });
  });
});
