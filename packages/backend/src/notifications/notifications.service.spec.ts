import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { SupabaseService } from '../common/supabase';
import { ConfigService } from '@nestjs/config';
import { mockSupabaseService } from 'src/common/__mocks__/supabase';

jest.spyOn(console, 'error').mockImplementation(() => {});

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
        ConfigService,
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getNotifications', () => {
    const notifications = [
      {
        id: '1',
        user_id: '1',
        title: 'Notification title',
        message: 'Notification message',
        is_read: false,
        created_at: new Date(),
      },
    ];

    const mockGetNotificationsSuccess = () =>
      (
        mockSupabaseService.getClient().from('notifications').select('*')
          .order as jest.Mock
      ).mockResolvedValueOnce({
        data: notifications,
        error: null,
      });

    const mockGetNotificationsError = () =>
      (
        mockSupabaseService.getClient().from('notifications').select('*')
          .order as jest.Mock
      ).mockResolvedValueOnce({
        data: null,
        error: 'An error occurred while fetching notifications',
      });

    it('should return notifications', async () => {
      mockGetNotificationsSuccess();

      const result = await service.getNotifications();

      expect(result).toEqual(notifications);
    });

    it('should throw an error when fetching notifications fails', async () => {
      mockGetNotificationsError();

      await expect(service.getNotifications()).rejects.toThrow(
        'An error occurred while fetching notifications',
      );
    });
  });

  describe('markAllNotificationsAsRead', () => {
    const mockMarkAllNotificationsAsReadSuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('notifications')
          .update({ is_read: true }).eq as jest.Mock
      ).mockResolvedValueOnce({ error: null });

    const mockMarkAllNotificationsAsReadError = () =>
      (
        mockSupabaseService
          .getClient()
          .from('notifications')
          .update({ is_read: true }).eq as jest.Mock
      ).mockResolvedValueOnce({
        error: 'An error occurred while updating notifications',
      });

    it('should mark all notifications as read', async () => {
      mockMarkAllNotificationsAsReadSuccess();

      const result = await service.markAllNotificationsAsRead('1');

      expect(result).toEqual({
        success: true,
        message: 'All notifications have been marked as read',
      });
    });

    it('should throw an error when updating notifications fails', async () => {
      mockMarkAllNotificationsAsReadError();

      await expect(service.markAllNotificationsAsRead('1')).rejects.toThrow(
        'An error occurred while updating notifications',
      );
    });
  });

  describe('deleteAllNotifications', () => {
    const mockDeleteAllNotificationsSuccess = () =>
      (
        mockSupabaseService.getClient().from('notifications').delete()
          .eq as jest.Mock
      ).mockResolvedValueOnce({ error: null });

    const mockDeleteAllNotificationsError = () =>
      (
        mockSupabaseService.getClient().from('notifications').delete()
          .eq as jest.Mock
      ).mockResolvedValueOnce({
        error: 'An error occurred while deleting notifications',
      });

    it('should delete all notifications', async () => {
      mockDeleteAllNotificationsSuccess();

      const result = await service.deleteAllNotifications('1');

      expect(result).toEqual({
        success: true,
        message: 'All notifications have been deleted',
      });
    });

    it('should throw an error when deleting notifications fails', async () => {
      mockDeleteAllNotificationsError();

      await expect(service.deleteAllNotifications('1')).rejects.toThrow(
        'An error occurred while deleting notifications',
      );
    });
  });

  describe('saveTokenForUser', () => {
    const mockSaveTokenForUserSuccess = () =>
      (
        mockSupabaseService.getClient().from('push_notification_tokens')
          .insert as jest.Mock
      ).mockResolvedValueOnce({ error: null });

    const mockSaveTokenForUserError = () =>
      (
        mockSupabaseService.getClient().from('push_notification_tokens')
          .insert as jest.Mock
      ).mockResolvedValueOnce({
        error: 'An error occurred while saving the token',
      });

    it('should save the token for the user', async () => {
      mockSaveTokenForUserSuccess();

      const result = await service.saveTokenForUser('1', 'token');

      expect(result).toEqual({
        success: true,
        message: 'The token has been saved',
      });
    });

    it('should throw an error when saving the token fails', async () => {
      mockSaveTokenForUserError();

      await expect(service.saveTokenForUser('1', 'token')).rejects.toThrow(
        'An error occurred while saving the token',
      );
    });
  });
});
