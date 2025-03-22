import { Test, TestingModule } from '@nestjs/testing';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';
import { mockLeaderboardService } from 'src/common/__mocks__/leaderboard.service';
import { UserIdDto } from '../common/dto/params/user.dto';

describe('LeaderboardController', () => {
  let leaderboardController: LeaderboardController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [LeaderboardController],
      providers: [
        {
          provide: LeaderboardService,
          useValue: mockLeaderboardService,
        },
      ],
    }).compile();

    leaderboardController = app.get<LeaderboardController>(
      LeaderboardController,
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getGlobalLeaderboard', () => {
    const mockLeaderboardData = [
      { user_id: '1', xp: 100 },
      { user_id: '2', xp: 200 },
    ];

    const mockGetGlobalLeaderboardSuccess = () =>
      (
        mockLeaderboardService.getGlobalLeaderboard as jest.Mock
      ).mockResolvedValueOnce(mockLeaderboardData);

    const mockGetGlobalLeaderboardFailure = () =>
      (
        mockLeaderboardService.getGlobalLeaderboard as jest.Mock
      ).mockRejectedValueOnce(new Error('error'));

    it('should get global leaderboard', async () => {
      mockGetGlobalLeaderboardSuccess();

      const result = await leaderboardController.getGlobalLeaderboard();

      expect(result).toEqual(mockLeaderboardData);
      expect(mockLeaderboardService.getGlobalLeaderboard).toHaveBeenCalled();
    });

    it('should throw an error if the global leaderboard fails', async () => {
      mockGetGlobalLeaderboardFailure();

      await expect(
        leaderboardController.getGlobalLeaderboard(),
      ).rejects.toThrow('error');
      expect(mockLeaderboardService.getGlobalLeaderboard).toHaveBeenCalled();
    });
  });

  describe('getFriendsLeaderboard', () => {
    const userIdDto: UserIdDto = { userId: 'user1' };
    const mockFriendsLeaderboardData = [
      { user_id: '1', xp: 100 },
      { user_id: '2', xp: 200 },
    ];

    const mockGetFriendsLeaderboardSuccess = () =>
      (
        mockLeaderboardService.getFriendsLeaderboard as jest.Mock
      ).mockResolvedValueOnce(mockFriendsLeaderboardData);

    const mockGetFriendsLeaderboardFailure = () =>
      (
        mockLeaderboardService.getFriendsLeaderboard as jest.Mock
      ).mockRejectedValueOnce(new Error('error'));

    it('should get friends leaderboard', async () => {
      mockGetFriendsLeaderboardSuccess();

      const result =
        await leaderboardController.getFriendsLeaderboard(userIdDto);

      expect(result).toEqual(mockFriendsLeaderboardData);
      expect(mockLeaderboardService.getFriendsLeaderboard).toHaveBeenCalledWith(
        userIdDto.userId,
      );
    });

    it('should throw an error if the friends leaderboard fails', async () => {
      mockGetFriendsLeaderboardFailure();

      await expect(
        leaderboardController.getFriendsLeaderboard(userIdDto),
      ).rejects.toThrow('error');
      expect(mockLeaderboardService.getFriendsLeaderboard).toHaveBeenCalledWith(
        userIdDto.userId,
      );
    });
  });
});
