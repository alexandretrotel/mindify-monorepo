import { Test, TestingModule } from '@nestjs/testing';
import { FriendService } from './friend.service';
import { SupabaseService } from '../common/supabase';
import { ConfigService } from '@nestjs/config';
import { NotificationService } from 'src/notification/notification.service';
import { ExpoService } from '../common/expo/expo.service';
import { UserService } from 'src/user/user.service';
import { mockSupabaseService } from 'src/common/__mocks__/supabase';
import { mockNotificationService } from 'src/common/__mocks__/notification.service';

jest.spyOn(console, 'error').mockImplementation();

describe('FriendService', () => {
  let service: FriendService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FriendService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
        ConfigService,
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
        ExpoService,
        UserService,
      ],
    }).compile();

    service = module.get<FriendService>(FriendService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('askForFriend', () => {
    const mockUserId = 'user1';
    const mockProfileId = 'user2';

    const mockAskForFriendSuccess = () =>
      (
        mockSupabaseService.getClient().from('friends').insert as jest.Mock
      ).mockResolvedValueOnce({
        error: null,
      });

    const mockAskForFriendFailure = () =>
      (
        mockSupabaseService.getClient().from('friends').insert as jest.Mock
      ).mockResolvedValueOnce({
        error: new Error('Database error'),
      });

    it('should send a friend request successfully', async () => {
      mockAskForFriendSuccess();

      const result = await service.askForFriend(mockUserId, mockProfileId);

      expect(result).toEqual({
        success: true,
        message: 'Friend request sent successfully.',
      });
    });

    it('should throw an error when trying to be friend with yourself', async () => {
      await expect(
        service.askForFriend(mockUserId, mockUserId),
      ).rejects.toThrow('It is not possible to be friend with yourself.');
    });

    it("should throw an error when the user ID and profile ID aren't provided", async () => {
      await expect(service.askForFriend('', '')).rejects.toThrow(
        'The user ID and profile ID are required.',
      );
    });

    it("should throw an error when the user ID isn't provided", async () => {
      await expect(service.askForFriend('', mockProfileId)).rejects.toThrow(
        'The user ID and profile ID are required.',
      );
    });

    it("should throw an error when the profile ID isn't provided", async () => {
      await expect(service.askForFriend(mockUserId, '')).rejects.toThrow(
        'The user ID and profile ID are required.',
      );
    });

    it('should throw an error when an error occurs while sending the friend request', async () => {
      mockAskForFriendFailure();

      await expect(
        service.askForFriend(mockUserId, mockProfileId),
      ).rejects.toThrow('An error occurred while sending the friend request.');
    });
  });

  describe('cancelFriendRequest', () => {
    const mockUserId = 'user1';
    const mockProfileId = 'user2';

    const mockCancelFriendRequestSuccess = () =>
      (
        mockSupabaseService.getClient().from('friends').delete()
          .match as jest.Mock
      ).mockResolvedValueOnce({
        error: null,
      });

    const mockCancelFriendRequestFailure = () =>
      (
        mockSupabaseService.getClient().from('friends').delete()
          .match as jest.Mock
      ).mockResolvedValueOnce({
        error: new Error('Database error'),
      });

    it('should cancel a friend request successfully', async () => {
      mockCancelFriendRequestSuccess();

      const result = await service.cancelFriendRequest(
        mockUserId,
        mockProfileId,
      );

      expect(result).toEqual({
        success: true,
        message: 'Friend request canceled successfully.',
      });
    });

    it('should throw an error when an error occurs while canceling the friend request', async () => {
      mockCancelFriendRequestFailure();

      await expect(
        service.cancelFriendRequest(mockUserId, mockProfileId),
      ).rejects.toThrow(
        'An error occurred while canceling the friend request.',
      );
    });

    it('should throw an error when the user ID and profile ID are not provided', async () => {
      await expect(service.cancelFriendRequest('', '')).rejects.toThrow(
        'The user ID and profile ID are required.',
      );
    });

    it('should throw an error when the user ID is not provided', async () => {
      await expect(
        service.cancelFriendRequest('', mockProfileId),
      ).rejects.toThrow('The user ID and profile ID are required.');
    });

    it('should throw an error when the profile ID is not provided', async () => {
      await expect(service.cancelFriendRequest(mockUserId, '')).rejects.toThrow(
        'The user ID and profile ID are required.',
      );
    });

    it('should throw an error when the user ID and profile ID are the same', async () => {
      await expect(
        service.cancelFriendRequest(mockUserId, mockUserId),
      ).rejects.toThrow('It is not possible to be friend with yourself.');
    });
  });

  describe('acceptFriendRequest', () => {
    const mockUserId = 'user1';
    const mockProfileId = 'user2';

    const mockAcceptFriendRequestSuccess = () =>
      (
        mockSupabaseService.getClient().from('friends').upsert as jest.Mock
      ).mockResolvedValueOnce({
        error: null,
      });

    const mockAcceptFriendRequestFailure = () =>
      (
        mockSupabaseService.getClient().from('friends').upsert as jest.Mock
      ).mockResolvedValueOnce({
        error: new Error('Database error'),
      });

    it('should accept a friend request successfully', async () => {
      mockAcceptFriendRequestSuccess();

      const result = await service.acceptFriendRequest(
        mockUserId,
        mockProfileId,
      );

      expect(result).toEqual({
        success: true,
        message: 'Friend request accepted successfully.',
      });
    });

    it('should throw an error when an error occurs while accepting the friend request', async () => {
      mockAcceptFriendRequestFailure();

      await expect(
        service.acceptFriendRequest(mockUserId, mockProfileId),
      ).rejects.toThrow(
        'An error occurred while accepting the friend request.',
      );
    });

    it('should throw an error when the user ID and profile ID are not provided', async () => {
      await expect(service.acceptFriendRequest('', '')).rejects.toThrow(
        'The user ID and profile ID are required.',
      );
    });

    it('should throw an error when the user ID is not provided', async () => {
      await expect(
        service.acceptFriendRequest('', mockProfileId),
      ).rejects.toThrow('The user ID and profile ID are required.');
    });

    it('should throw an error when the profile ID is not provided', async () => {
      await expect(service.acceptFriendRequest(mockUserId, '')).rejects.toThrow(
        'The user ID and profile ID are required.',
      );
    });

    it('should throw an error when the user ID and profile ID are the same', async () => {
      await expect(
        service.acceptFriendRequest(mockUserId, mockUserId),
      ).rejects.toThrow('It is not possible to be friend with yourself.');
    });
  });

  describe('rejectFriendRequest', () => {
    const mockUserId = 'user1';
    const mockProfileId = 'user2';

    const mockRejectFriendRequestSuccess = () =>
      (
        mockSupabaseService.getClient().from('friends').delete()
          .match as jest.Mock
      ).mockResolvedValueOnce({
        error: null,
      });

    const mockRejectFriendRequestFailure = () =>
      (
        mockSupabaseService.getClient().from('friends').delete()
          .match as jest.Mock
      ).mockResolvedValueOnce({
        error: new Error('Database error'),
      });

    it('should reject a friend request successfully', async () => {
      mockRejectFriendRequestSuccess();

      const result = await service.rejectFriendRequest(
        mockUserId,
        mockProfileId,
      );

      expect(result).toEqual({
        success: true,
        message: 'Friend request rejected successfully.',
      });
    });

    it('should throw an error when an error occurs while rejecting the friend request', async () => {
      mockRejectFriendRequestFailure();

      await expect(
        service.rejectFriendRequest(mockUserId, mockProfileId),
      ).rejects.toThrow(
        'An error occurred while rejecting the friend request.',
      );
    });

    it('should throw an error when the user ID and profile ID are not provided', async () => {
      await expect(service.rejectFriendRequest('', '')).rejects.toThrow(
        'The user ID and profile ID are required.',
      );
    });

    it('should throw an error when the user ID is not provided', async () => {
      await expect(
        service.rejectFriendRequest('', mockProfileId),
      ).rejects.toThrow('The user ID and profile ID are required.');
    });

    it('should throw an error when the profile ID is not provided', async () => {
      await expect(service.rejectFriendRequest(mockUserId, '')).rejects.toThrow(
        'The user ID and profile ID are required.',
      );
    });

    it('should throw an error when the user ID and profile ID are the same', async () => {
      await expect(
        service.rejectFriendRequest(mockUserId, mockUserId),
      ).rejects.toThrow('It is not possible to be friend with yourself.');
    });
  });

  describe('removeFriend', () => {
    const mockUserId = 'user1';
    const mockProfileId = 'user2';

    const mockRemoveFriendSuccess = () =>
      (
        mockSupabaseService.getClient().from('friends').delete()
          .match as jest.Mock
      ).mockResolvedValueOnce({
        error: null,
      });

    const mockRemoveFriendFailure = () =>
      (
        mockSupabaseService.getClient().from('friends').delete()
          .match as jest.Mock
      ).mockResolvedValueOnce({
        error: new Error('Database error'),
      });

    it('should remove a friend successfully', async () => {
      mockRemoveFriendSuccess();

      const result = await service.removeFriend(mockUserId, mockProfileId);

      expect(result).toEqual({
        success: true,
        message: 'Friend removed successfully.',
      });
    });

    it('should throw an error when an error occurs while removing the friend', async () => {
      mockRemoveFriendFailure();

      await expect(
        service.removeFriend(mockUserId, mockProfileId),
      ).rejects.toThrow('An error occurred while removing the friend.');
    });

    it('should throw an error when the user ID and profile ID are not provided', async () => {
      await expect(service.removeFriend('', '')).rejects.toThrow(
        'The user ID and profile ID are required.',
      );
    });

    it('should throw an error when the user ID is not provided', async () => {
      await expect(service.removeFriend('', mockProfileId)).rejects.toThrow(
        'The user ID and profile ID are required.',
      );
    });

    it('should throw an error when the profile ID is not provided', async () => {
      await expect(service.removeFriend(mockUserId, '')).rejects.toThrow(
        'The user ID and profile ID are required.',
      );
    });

    it('should throw an error when the user ID and profile ID are the same', async () => {
      await expect(
        service.removeFriend(mockUserId, mockUserId),
      ).rejects.toThrow('It is not possible to be friend with yourself.');
    });
  });

  describe('getFriendStatus', () => {
    const mockUserId = 'user1';
    const mockProfileId = 'user2';

    const mockUserFriends = [
      { friend_id: 'user2' },
      { friend_id: 'user3' },
      { friend_id: 'user6' },
    ];
    const mockProfileFriends = [{ friend_id: 'user1' }, { friend_id: 'user3' }];

    const mockGetUserFriendsSuccess = () =>
      (
        mockSupabaseService.getClient().from('friends').select('friend_id')
          .eq as jest.Mock
      ).mockResolvedValueOnce({
        data: mockUserFriends,
        error: null,
      });

    const mockGetUserFriendsFailure = () =>
      (
        mockSupabaseService.getClient().from('friends').select('friend_id')
          .eq as jest.Mock
      ).mockResolvedValueOnce({
        data: null,
        error: new Error('Database error'),
      });

    const mockGetProfileFriendsSuccess = () =>
      (
        mockSupabaseService.getClient().from('friends').select('friend_id')
          .eq as jest.Mock
      ).mockResolvedValueOnce({
        data: mockProfileFriends,
        error: null,
      });

    const mockGetProfileFriendsFailure = () =>
      (
        mockSupabaseService.getClient().from('friends').select('friend_id')
          .eq as jest.Mock
      ).mockResolvedValueOnce({
        data: null,
        error: new Error('Database error'),
      });

    it('should throw an error when an error occurs while getting the user friends', async () => {
      mockGetUserFriendsFailure();

      await expect(
        service.getFriendStatus(mockUserId, mockProfileId),
      ).rejects.toThrow("An error occurred while getting the user's friends.");
    });

    it('should throw an error when an error occurs while getting the profile friends', async () => {
      mockGetUserFriendsSuccess();
      mockGetProfileFriendsFailure();

      await expect(
        service.getFriendStatus(mockUserId, mockProfileId),
      ).rejects.toThrow(
        "An error occurred while getting the profile's friends.",
      );
    });

    it('should throw an error when the user ID and profile ID are not provided', async () => {
      await expect(service.getFriendStatus('', '')).rejects.toThrow(
        'The user ID and profile ID are required.',
      );
    });

    it('should throw an error when the user ID is not provided', async () => {
      await expect(service.getFriendStatus('', mockProfileId)).rejects.toThrow(
        'The user ID and profile ID are required.',
      );
    });

    it('should throw an error when the profile ID is not provided', async () => {
      await expect(service.getFriendStatus(mockUserId, '')).rejects.toThrow(
        'The user ID and profile ID are required.',
      );
    });

    it('should throw an error when the user ID and profile ID are the same', async () => {
      await expect(
        service.getFriendStatus(mockUserId, mockUserId),
      ).rejects.toThrow('It is not possible to be friend with yourself.');
    });

    it('should return the friend status as pending', async () => {
      mockGetUserFriendsSuccess();
      mockGetProfileFriendsSuccess();

      const result = await service.getFriendStatus(mockProfileId, 'user6');

      expect(result).toEqual({ status: 'pending' });
    });

    it('should return the friend status as accepted', async () => {
      mockGetUserFriendsSuccess();
      mockGetProfileFriendsSuccess();

      const result = await service.getFriendStatus(mockUserId, mockProfileId);

      expect(result).toEqual({ status: 'accepted' });
    });

    it('should return the friend status as requested', async () => {
      mockGetUserFriendsSuccess();
      mockGetProfileFriendsSuccess();

      const result = await service.getFriendStatus('user3', mockUserId);

      expect(result).toEqual({ status: 'requested' });
    });

    it('should return the friend status as none', async () => {
      mockGetUserFriendsSuccess();
      mockGetProfileFriendsSuccess();

      const result = await service.getFriendStatus('user4', 'user5');

      expect(result).toEqual({ status: 'none' });
    });
  });
});
