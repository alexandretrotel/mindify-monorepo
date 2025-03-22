import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { mockUserService } from 'src/common/__mocks__/user.service';

describe('UserController', () => {
  let userController: UserController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = app.get<UserController>(UserController);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserMetadata', () => {
    const userId = 'userId';

    const mockGetUserMetadataSuccess = () =>
      (mockUserService.getUserMetadata as jest.Mock).mockResolvedValueOnce({
        userId,
        email: 'jean@gmail.com',
        username: 'jean',
        biography: 'I am a software developer',
        level: 1,
      });

    it('should return user metadata', async () => {
      mockGetUserMetadataSuccess();

      const result = await userController.getUserMetadata({ userId });

      expect(result).toEqual({
        userId,
        email: 'jean@gmail.com',
        username: 'jean',
        biography: 'I am a software developer',
        level: 1,
      });
    });

    it('should call getUserMetadata with correct arguments', async () => {
      mockGetUserMetadataSuccess();

      await userController.getUserMetadata({ userId });

      expect(mockUserService.getUserMetadata).toHaveBeenCalledWith(userId);
    });

    it('should throw an error if getUserMetadata throws an error', async () => {
      const error = new Error('getUserMetadata error');
      (mockUserService.getUserMetadata as jest.Mock).mockRejectedValueOnce(
        error,
      );

      await expect(userController.getUserMetadata({ userId })).rejects.toThrow(
        error,
      );
    });
  });

  describe('deleteUser', () => {
    const userId = 'userId';

    const mockDeleteUserSuccess = () =>
      (mockUserService.deleteUser as jest.Mock).mockResolvedValueOnce({
        success: true,
      });

    it('should delete user', async () => {
      mockDeleteUserSuccess();

      const result = await userController.deleteUser({ userId });

      expect(result).toEqual({ success: true });
    });

    it('should call deleteUser with correct arguments', async () => {
      mockDeleteUserSuccess();

      await userController.deleteUser({ userId });

      expect(mockUserService.deleteUser).toHaveBeenCalledWith(userId);
    });

    it('should throw an error if deleteUser throws an error', async () => {
      const error = new Error('deleteUser error');
      (mockUserService.deleteUser as jest.Mock).mockRejectedValueOnce(error);

      await expect(userController.deleteUser({ userId })).rejects.toThrow(
        error,
      );
    });
  });

  describe('getUserLevel', () => {
    const userId = 'userId';

    const mockGetUserLevelSuccess = () =>
      (mockUserService.getUserLevel as jest.Mock).mockResolvedValueOnce({
        level: 1,
      });

    it('should return user level', async () => {
      mockGetUserLevelSuccess();

      const result = await userController.getUserLevel({ userId });

      expect(result).toEqual({ level: 1 });
    });

    it('should call getUserLevel with correct arguments', async () => {
      mockGetUserLevelSuccess();

      await userController.getUserLevel({ userId });

      expect(mockUserService.getUserLevel).toHaveBeenCalledWith(userId);
    });

    it('should throw an error if getUserLevel throws an error', async () => {
      const error = new Error('getUserLevel error');
      (mockUserService.getUserLevel as jest.Mock).mockRejectedValueOnce(error);

      await expect(userController.getUserLevel({ userId })).rejects.toThrow(
        error,
      );
    });
  });

  describe('getUserFriends', () => {
    const userId = 'userId';

    const mockGetUserFriendsSuccess = () =>
      (mockUserService.getUserFriends as jest.Mock).mockResolvedValueOnce({
        friends: ['friend1', 'friend2'],
      });

    it('should return user friends', async () => {
      mockGetUserFriendsSuccess();

      const result = await userController.getUserFriends({ userId });

      expect(result).toEqual({ friends: ['friend1', 'friend2'] });
    });

    it('should call getUserFriends with correct arguments', async () => {
      mockGetUserFriendsSuccess();

      await userController.getUserFriends({ userId });

      expect(mockUserService.getUserFriends).toHaveBeenCalledWith(userId);
    });

    it('should throw an error if getUserFriends throws an error', async () => {
      const error = new Error('getUserFriends error');
      (mockUserService.getUserFriends as jest.Mock).mockRejectedValueOnce(
        error,
      );

      await expect(userController.getUserFriends({ userId })).rejects.toThrow(
        error,
      );
    });
  });

  describe('getFriendIds', () => {
    const userId = 'userId';

    const mockGetFriendIdsSuccess = () =>
      (mockUserService.getFriendIds as jest.Mock).mockResolvedValueOnce({
        friendIds: ['friend1', 'friend2'],
      });

    it('should return friend ids', async () => {
      mockGetFriendIdsSuccess();

      const result = await userController.getFriendIds({ userId });

      expect(result).toEqual({ friendIds: ['friend1', 'friend2'] });
    });

    it('should call getFriendIds with correct arguments', async () => {
      mockGetFriendIdsSuccess();

      await userController.getFriendIds({ userId });

      expect(mockUserService.getFriendIds).toHaveBeenCalledWith(userId);
    });

    it('should throw an error if getFriendIds throws an error', async () => {
      const error = new Error('getFriendIds error');
      (mockUserService.getFriendIds as jest.Mock).mockRejectedValueOnce(error);

      await expect(userController.getFriendIds({ userId })).rejects.toThrow(
        error,
      );
    });
  });

  describe('getPendingFriendIds', () => {
    const userId = 'userId';

    const mockGetPendingFriendIdsSuccess = () =>
      (mockUserService.getPendingFriendIds as jest.Mock).mockResolvedValueOnce({
        pendingFriendIds: ['friend1', 'friend2'],
      });

    it('should return pending friend ids', async () => {
      mockGetPendingFriendIdsSuccess();

      const result = await userController.getPendingFriendIds({ userId });

      expect(result).toEqual({ pendingFriendIds: ['friend1', 'friend2'] });
    });

    it('should call getPendingFriendIds with correct arguments', async () => {
      mockGetPendingFriendIdsSuccess();

      await userController.getPendingFriendIds({ userId });

      expect(mockUserService.getPendingFriendIds).toHaveBeenCalledWith(userId);
    });

    it('should throw an error if getPendingFriendIds throws an error', async () => {
      const error = new Error('getPendingFriendIds error');
      (mockUserService.getPendingFriendIds as jest.Mock).mockRejectedValueOnce(
        error,
      );

      await expect(
        userController.getPendingFriendIds({ userId }),
      ).rejects.toThrow(error);
    });
  });

  describe('updateProfile', () => {
    const updateProfileDto = {
      username: 'jean',
      biography: 'I am a software developer',
    };

    const mockUpdateProfileSuccess = () =>
      (mockUserService.updateProfile as jest.Mock).mockResolvedValueOnce({
        success: true,
      });

    it('should update user profile', async () => {
      mockUpdateProfileSuccess();

      const result = await userController.updateProfile(updateProfileDto);

      expect(result).toEqual({ success: true });
    });

    it('should call updateProfile with correct arguments', async () => {
      mockUpdateProfileSuccess();

      await userController.updateProfile(updateProfileDto);

      expect(mockUserService.updateProfile).toHaveBeenCalledWith(
        updateProfileDto.username,
        updateProfileDto.biography,
      );
    });

    it('should throw an error if updateProfile throws an error', async () => {
      const error = new Error('updateProfile error');
      (mockUserService.updateProfile as jest.Mock).mockRejectedValueOnce(error);

      await expect(
        userController.updateProfile(updateProfileDto),
      ).rejects.toThrow(error);
    });
  });
});
