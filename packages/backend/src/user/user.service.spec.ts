import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { SupabaseService } from '../common/supabase';
import { ConfigService } from '@nestjs/config';
import { mockSupabaseService } from 'src/common/__mocks__/supabase';

jest.spyOn(console, 'error').mockImplementation();

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
        ConfigService,
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserMetadata', () => {
    const userId = '123';

    const mockGetUserMetadataSuccess = () =>
      (
        mockSupabaseService.getClient().rpc('fetch_user_metadata', {
          user_id: userId,
        }).maybeSingle as jest.Mock
      ).mockResolvedValueOnce({
        data: {
          id: userId,
          name: 'test',
        },
      });

    const mockGetUserMetadataError = () =>
      (
        mockSupabaseService.getClient().rpc('fetch_user_metadata', {
          user_id: userId,
        }).maybeSingle as jest.Mock
      ).mockResolvedValueOnce({
        error: 'error',
      });

    it('should return user metadata', async () => {
      mockGetUserMetadataSuccess();

      const result = await service.getUserMetadata(userId);

      expect(result).toEqual({
        metadata: {
          id: userId,
          name: 'test',
        },
      });
    });

    it('should throw an error if the request fails', async () => {
      mockGetUserMetadataError();

      await expect(service.getUserMetadata(userId)).rejects.toThrow();
    });
  });

  describe('deleteUser', () => {
    const userId = '123';

    const mockDeleteUserSuccess = () =>
      (mockSupabaseService.getClient().rpc as jest.Mock).mockResolvedValueOnce(
        {},
      );

    const mockDeleteUserError = () =>
      (mockSupabaseService.getClient().rpc as jest.Mock).mockResolvedValueOnce({
        error: 'error',
      });

    it('should delete the user', async () => {
      mockDeleteUserSuccess();

      const result = await service.deleteUser(userId);

      expect(result).toEqual({
        success: true,
        message: 'Account deleted successfully.',
      });
    });

    it('should throw an error if the request fails', async () => {
      mockDeleteUserError();

      await expect(service.deleteUser(userId)).rejects.toThrow();
    });
  });

  describe('getUserLevel', () => {
    const userId = '123';

    const mockGetUserLevelSuccess = () =>
      (mockSupabaseService.getClient().rpc as jest.Mock).mockResolvedValueOnce({
        data: [
          {
            xp: 10,
            level: 1,
            xp_for_next_level: 20,
            xp_of_current_level: 0,
            progression: 50,
          },
        ],
      });

    const mockGetUserLevelError = () =>
      (mockSupabaseService.getClient().rpc as jest.Mock).mockResolvedValueOnce({
        error: 'error',
      });

    it('should return the user level', async () => {
      mockGetUserLevelSuccess();

      const result = await service.getUserLevel(userId);

      expect(result).toEqual({
        xp: 10,
        level: 1,
        xp_for_next_level: 20,
        xp_of_current_level: 0,
        progression: 50,
      });
    });

    it('should throw an error if the request fails', async () => {
      mockGetUserLevelError();

      await expect(service.getUserLevel(userId)).rejects.toThrow();
    });
  });

  describe('getUserFriends', () => {
    const userId = '123';

    const mockGetUserFriendsSuccess = () =>
      (mockSupabaseService.getClient().rpc as jest.Mock).mockResolvedValueOnce({
        data: [
          {
            id: '456',
            name: 'friend',
          },
        ],
      });

    const mockGetUserFriendsError = () =>
      (mockSupabaseService.getClient().rpc as jest.Mock).mockResolvedValueOnce({
        error: 'error',
      });

    it('should return the user friends', async () => {
      mockGetUserFriendsSuccess();

      const result = await service.getUserFriends(userId);

      expect(result).toEqual([
        {
          id: '456',
          name: 'friend',
        },
      ]);
    });

    it('should throw an error if the request fails', async () => {
      mockGetUserFriendsError();

      await expect(service.getUserFriends(userId)).rejects.toThrow();
    });
  });

  describe('getFriendIds', () => {
    const userId = '123';

    const mockGetFriendIdsSuccess = () =>
      (
        mockSupabaseService.getClient().from('friends').select('friend_id')
          .eq as jest.Mock
      ).mockResolvedValueOnce({
        data: [
          {
            friend_id: '456',
          },
        ],
      });

    const mockGetFriendIdsNotFound = () =>
      (
        mockSupabaseService.getClient().from('friends').select('friend_id')
          .eq as jest.Mock
      ).mockResolvedValueOnce({
        data: [],
      });

    const mockGetFriendIdsError = () =>
      (
        mockSupabaseService.getClient().from('friends').select('friend_id')
          .eq as jest.Mock
      ).mockResolvedValueOnce({
        error: 'error',
      });

    const mockGetFriendIdsWhoAskedSuccess = () =>
      (
        mockSupabaseService.getClient().from('friends').select('user_id')
          .eq as jest.Mock
      ).mockResolvedValueOnce({
        data: [
          {
            user_id: '456',
          },
        ],
      });

    const mockGetFriendIdsWhoAskedNotFound = () =>
      (
        mockSupabaseService.getClient().from('friends').select('user_id')
          .eq as jest.Mock
      ).mockResolvedValueOnce({
        data: [],
      });

    const mockGetFriendIdsWhoAskedError = () =>
      (
        mockSupabaseService.getClient().from('friends').select('user_id')
          .eq as jest.Mock
      ).mockResolvedValueOnce({
        error: 'error',
      });

    it('should return the friend ids', async () => {
      mockGetFriendIdsSuccess();
      mockGetFriendIdsWhoAskedSuccess();

      const result = await service.getFriendIds(userId);

      expect(result).toEqual({
        askedFriendsIds: [],
        friendsIds: ['456'],
        requestedFriendsIds: [],
      });
    });

    it('should throw an error if the request fails', async () => {
      mockGetFriendIdsError();

      await expect(service.getFriendIds(userId)).rejects.toThrow();
    });

    it('should throw an error if the request fails', async () => {
      mockGetFriendIdsSuccess();
      mockGetFriendIdsWhoAskedError();

      await expect(service.getFriendIds(userId)).rejects.toThrow();
    });

    it('should return an empty array if there are no friends', async () => {
      mockGetFriendIdsNotFound();
      mockGetFriendIdsWhoAskedNotFound();

      const result = await service.getFriendIds(userId);

      expect(result).toEqual({
        askedFriendsIds: [],
        friendsIds: [],
        requestedFriendsIds: [],
      });
    });
  });

  describe('getPendingFriendIds', () => {
    const userId = '123';

    const mockGetPendingFriendIdsSuccess = () =>
      (
        mockSupabaseService.getClient().from('friends').select('friend_id')
          .eq as jest.Mock
      ).mockResolvedValueOnce({
        data: [
          {
            friend_id: '456',
          },
        ],
      });

    const mockGetPendingFriendIdsNotFound = () =>
      (
        mockSupabaseService.getClient().from('friends').select('friend_id')
          .eq as jest.Mock
      ).mockResolvedValueOnce({
        data: [],
      });

    const mockGetPendingFriendIdsError = () =>
      (
        mockSupabaseService.getClient().from('friends').select('friend_id')
          .eq as jest.Mock
      ).mockResolvedValueOnce({
        error: 'error',
      });

    it('should return the pending friend ids', async () => {
      mockGetPendingFriendIdsSuccess();

      const result = await service.getPendingFriendIds(userId);

      expect(result).toEqual({ pendingFriendsIds: ['456'] });
    });

    it('should throw an error if the request fails', async () => {
      mockGetPendingFriendIdsError();

      await expect(service.getPendingFriendIds(userId)).rejects.toThrow();
    });

    it('should return an empty array if there are no pending friends', async () => {
      mockGetPendingFriendIdsNotFound();

      const result = await service.getPendingFriendIds(userId);

      expect(result).toEqual({ pendingFriendsIds: [] });
    });
  });

  describe('updateProfile', () => {
    const username = 'test';
    const biography = 'test';

    const mockUpdateProfileSuccess = () =>
      (
        mockSupabaseService.getClient().auth.updateUser as jest.Mock
      ).mockResolvedValueOnce({
        error: null,
      });

    const mockUpdateProfileError = () =>
      (
        mockSupabaseService.getClient().auth.updateUser as jest.Mock
      ).mockResolvedValueOnce({
        error: 'error',
      });

    it('should update the profile', async () => {
      mockUpdateProfileSuccess();

      const result = await service.updateProfile(username, biography);

      expect(result).toEqual({
        success: true,
        message: 'Profile updated successfully.',
      });
    });

    it('should throw an error if the request fails', async () => {
      mockUpdateProfileError();

      await expect(
        service.updateProfile(username, biography),
      ).rejects.toThrow();
    });
  });
});
