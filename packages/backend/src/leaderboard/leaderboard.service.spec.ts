import { Test, TestingModule } from '@nestjs/testing';
import { LeaderboardService } from './leaderboard.service';
import { SupabaseService } from '../common/supabase';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { mockSupabaseService } from 'src/common/__mocks__/supabase';
import { mockUserService } from 'src/common/__mocks__/user.service';

jest.spyOn(console, 'error').mockImplementation(() => null);

describe('LeaderboardService', () => {
  let service: LeaderboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeaderboardService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
        ConfigService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<LeaderboardService>(LeaderboardService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getGlobalLeaderboard', () => {
    const mockLeaderboardData = [
      { user_id: '1', xp: 100 },
      { user_id: '2', xp: 200 },
    ];

    const mockGetLeaderboardSuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('leaderboard')
          .select('user_id, xp').order as jest.Mock
      ).mockReturnValueOnce({
        data: mockLeaderboardData,
        error: null,
      });

    const mockGetLeaderboardError = () =>
      (
        mockSupabaseService
          .getClient()
          .from('leaderboard')
          .select('user_id, xp').order as jest.Mock
      ).mockReturnValueOnce({
        data: null,
        error: new Error(
          'An error occurred while fetching the global leaderboard.',
        ),
      });

    it('should return the global leaderboard', async () => {
      mockGetLeaderboardSuccess();

      const result = await service.getGlobalLeaderboard();

      expect(result).toEqual({
        length: mockLeaderboardData.length,
        leaderboard: mockLeaderboardData,
      });
    });

    it('should throw an error if an error occurs while fetching the global leaderboard', async () => {
      mockGetLeaderboardError();

      await expect(service.getGlobalLeaderboard()).rejects.toThrow(
        'An error occurred while fetching the global leaderboard.',
      );
    });
  });

  describe('getFriendsLeaderboard', () => {
    const friendsIds = ['2', '3'];
    const mockFriendsIdsAndUserId = ['2', '3', '1'];

    const mockGetFriendIdsSuccess = () =>
      (mockUserService.getFriendIds as jest.Mock).mockResolvedValueOnce({
        friendsIds: friendsIds,
      });

    const mockGetFriendIdsError = () =>
      (mockUserService.getFriendIds as jest.Mock).mockRejectedValueOnce(
        new Error('An error occurred while fetching the friends IDs.'),
      );

    const mockGetFriendsLeaderboardSuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('leaderboard')
          .select('user_id, xp')
          .in('user_id', mockFriendsIdsAndUserId).order as jest.Mock
      ).mockResolvedValueOnce({
        data: [],
        error: null,
      });

    const mockGetFriendsLeaderboardError = () =>
      (
        mockSupabaseService
          .getClient()
          .from('leaderboard')
          .select('user_id, xp')
          .in('user_id', mockFriendsIdsAndUserId).order as jest.Mock
      ).mockRejectedValueOnce(
        new Error('An error occurred while fetching the friends leaderboard.'),
      );

    it("should return the user's friends leaderboard", async () => {
      mockGetFriendIdsSuccess();
      mockGetFriendsLeaderboardSuccess();

      const result = await service.getFriendsLeaderboard('1');

      expect(result).toEqual({
        length: 0,
        leaderboard: [],
      });
    });

    it("should throw an error if an error occurs while fetching the user's friends IDs", async () => {
      mockGetFriendIdsError();

      await expect(service.getFriendsLeaderboard('1')).rejects.toThrow(
        'An error occurred while fetching the friends IDs.',
      );
    });

    it("should throw an error if an error occurs while fetching the user's friends leaderboard", async () => {
      mockGetFriendIdsSuccess();
      mockGetFriendsLeaderboardError();

      await expect(service.getFriendsLeaderboard('1')).rejects.toThrow(
        'An error occurred while fetching the friends leaderboard.',
      );
    });
  });
});
