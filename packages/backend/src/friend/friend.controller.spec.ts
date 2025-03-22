import { Test, TestingModule } from '@nestjs/testing';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
import { mockFriendService } from 'src/common/__mocks__/friend.service';

describe('FriendController', () => {
  let friendController: FriendController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FriendController],
      providers: [
        {
          provide: FriendService,
          useValue: mockFriendService,
        },
      ],
    }).compile();

    friendController = app.get<FriendController>(FriendController);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('askForFriend', () => {
    const userId = 'userId';
    const profileId = 'profileId';

    const mockAskForFriendSuccess = () =>
      (mockFriendService.askForFriend as jest.Mock).mockResolvedValueOnce({
        message: 'Friend request sent successfully.',
      });

    const mockAskForFriendFailure = () =>
      (mockFriendService.askForFriend as jest.Mock).mockRejectedValueOnce(
        new Error('error'),
      );

    it('should ask for friend', async () => {
      mockAskForFriendSuccess();

      const result = await friendController.askForFriend({
        userId,
        profileId,
      });

      expect(result).toEqual({
        message: 'Friend request sent successfully.',
      });
      expect(mockFriendService.askForFriend).toHaveBeenCalledWith(
        userId,
        profileId,
      );
    });

    it('should throw an error if the user ID is the same as the profile ID', async () => {
      const result = friendController.askForFriend({
        userId,
        profileId: userId,
      });

      await expect(result).rejects.toThrow(
        'It is not possible to be friend with yourself.',
      );
    });

    it('should throw an error if the request fails', async () => {
      mockAskForFriendFailure();

      const result = friendController.askForFriend({
        userId,
        profileId,
      });

      await expect(result).rejects.toThrow('error');
    });
  });

  describe('cancelFriendRequest', () => {
    const userId = 'userId';
    const profileId = 'profileId';

    const mockCancelFriendRequestSuccess = () =>
      (
        mockFriendService.cancelFriendRequest as jest.Mock
      ).mockResolvedValueOnce({
        message: 'Friend request canceled successfully.',
      });

    const mockCancelFriendRequestFailure = () =>
      (
        mockFriendService.cancelFriendRequest as jest.Mock
      ).mockRejectedValueOnce(new Error('error'));

    it('should cancel friend request', async () => {
      mockCancelFriendRequestSuccess();

      const result = await friendController.cancelFriendRequest({
        userId,
        profileId,
      });

      expect(result).toEqual({
        message: 'Friend request canceled successfully.',
      });
      expect(mockFriendService.cancelFriendRequest).toHaveBeenCalledWith(
        userId,
        profileId,
      );
    });

    it('should throw an error if the user ID is the same as the profile ID', async () => {
      const result = friendController.cancelFriendRequest({
        userId,
        profileId: userId,
      });

      await expect(result).rejects.toThrow(
        'It is not possible to be friend with yourself.',
      );
    });

    it('should throw an error if the request fails', async () => {
      mockCancelFriendRequestFailure();

      const result = friendController.cancelFriendRequest({
        userId,
        profileId,
      });

      await expect(result).rejects.toThrow('error');
    });
  });

  describe('acceptFriendRequest', () => {
    const userId = 'userId';
    const profileId = 'profileId';

    const mockAcceptFriendRequestSuccess = () =>
      (
        mockFriendService.acceptFriendRequest as jest.Mock
      ).mockResolvedValueOnce({
        message: 'Friend request accepted successfully.',
      });

    const mockAcceptFriendRequestFailure = () =>
      (
        mockFriendService.acceptFriendRequest as jest.Mock
      ).mockRejectedValueOnce(new Error('error'));

    it('should accept friend request', async () => {
      mockAcceptFriendRequestSuccess();

      const result = await friendController.acceptFriendRequest({
        userId,
        profileId,
      });

      expect(result).toEqual({
        message: 'Friend request accepted successfully.',
      });
      expect(mockFriendService.acceptFriendRequest).toHaveBeenCalledWith(
        userId,
        profileId,
      );
    });

    it('should throw an error if the user ID is the same as the profile ID', async () => {
      const result = friendController.acceptFriendRequest({
        userId,
        profileId: userId,
      });

      await expect(result).rejects.toThrow(
        'It is not possible to be friend with yourself.',
      );
    });

    it('should throw an error if the request fails', async () => {
      mockAcceptFriendRequestFailure();

      const result = friendController.acceptFriendRequest({
        userId,
        profileId,
      });

      await expect(result).rejects.toThrow('error');
    });
  });

  describe('rejectFriendRequest', () => {
    const userId = 'userId';
    const profileId = 'profileId';

    const mockRejectFriendRequestSuccess = () =>
      (
        mockFriendService.rejectFriendRequest as jest.Mock
      ).mockResolvedValueOnce({
        message: 'Friend request rejected successfully.',
      });

    const mockRejectFriendRequestFailure = () =>
      (
        mockFriendService.rejectFriendRequest as jest.Mock
      ).mockRejectedValueOnce(new Error('error'));

    it('should reject friend request', async () => {
      mockRejectFriendRequestSuccess();

      const result = await friendController.rejectFriendRequest({
        userId,
        profileId,
      });

      expect(result).toEqual({
        message: 'Friend request rejected successfully.',
      });
      expect(mockFriendService.rejectFriendRequest).toHaveBeenCalledWith(
        userId,
        profileId,
      );
    });

    it('should throw an error if the user ID is the same as the profile ID', async () => {
      const result = friendController.rejectFriendRequest({
        userId,
        profileId: userId,
      });

      await expect(result).rejects.toThrow(
        'It is not possible to be friend with yourself.',
      );
    });

    it('should throw an error if the request fails', async () => {
      mockRejectFriendRequestFailure();

      const result = friendController.rejectFriendRequest({
        userId,
        profileId,
      });

      await expect(result).rejects.toThrow('error');
    });
  });

  describe('removeFriend', () => {
    const userId = 'userId';
    const profileId = 'profileId';

    const mockRemoveFriendSuccess = () =>
      (mockFriendService.removeFriend as jest.Mock).mockResolvedValueOnce({
        message: 'Friend removed successfully.',
      });

    const mockRemoveFriendFailure = () =>
      (mockFriendService.removeFriend as jest.Mock).mockRejectedValueOnce(
        new Error('error'),
      );

    it('should remove friend', async () => {
      mockRemoveFriendSuccess();

      const result = await friendController.removeFriend({
        userId,
        profileId,
      });

      expect(result).toEqual({
        message: 'Friend removed successfully.',
      });
      expect(mockFriendService.removeFriend).toHaveBeenCalledWith(
        userId,
        profileId,
      );
    });

    it('should throw an error if the user ID is the same as the profile ID', async () => {
      const result = friendController.removeFriend({
        userId,
        profileId: userId,
      });

      await expect(result).rejects.toThrow(
        'It is not possible to be friend with yourself.',
      );
    });

    it('should throw an error if the request fails', async () => {
      mockRemoveFriendFailure();

      const result = friendController.removeFriend({
        userId,
        profileId,
      });

      await expect(result).rejects.toThrow('error');
    });
  });

  describe('getFriendStatus', () => {
    const userId = 'userId';
    const profileId = 'profileId';

    const mockGetFriendStatusSuccess = () =>
      (mockFriendService.getFriendStatus as jest.Mock).mockResolvedValueOnce({
        status: 'friends',
      });

    const mockGetFriendStatusFailure = () =>
      (mockFriendService.getFriendStatus as jest.Mock).mockRejectedValueOnce(
        new Error('error'),
      );

    it('should get friend status', async () => {
      mockGetFriendStatusSuccess();

      const result = await friendController.getFriendStatus({
        userId,
        profileId,
      });

      expect(result).toEqual({
        status: 'friends',
      });
      expect(mockFriendService.getFriendStatus).toHaveBeenCalledWith(
        userId,
        profileId,
      );
    });

    it('should throw an error if the user ID is the same as the profile ID', async () => {
      const result = friendController.getFriendStatus({
        userId,
        profileId: userId,
      });

      await expect(result).rejects.toThrow(
        'It is not possible to be friend with yourself.',
      );
    });

    it('should throw an error if the request fails', async () => {
      mockGetFriendStatusFailure();

      const result = friendController.getFriendStatus({
        userId,
        profileId,
      });

      await expect(result).rejects.toThrow('error');
    });
  });
});
