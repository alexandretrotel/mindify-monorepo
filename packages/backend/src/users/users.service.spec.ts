import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { SupabaseService } from '../common/supabase';
import { ConfigService } from '@nestjs/config';
import { mockSupabaseService } from 'src/common/__mocks__/supabase';

jest.spyOn(console, 'error').mockImplementation();

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
        ConfigService,
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('searchUsers', () => {
    const query = 'test query';
    const users = [
      { id: 1, name: 'test user', avatar: 'https://example.com/avatar.jpg' },
      { id: 2, name: 'another user', avatar: 'https://example.com/avatar.jpg' },
    ];

    const mockSearchUsersSuccess = () =>
      (mockSupabaseService.getClient().rpc as jest.Mock).mockResolvedValueOnce({
        data: users,
        error: null,
      });

    const mockSearchUsersError = () =>
      (mockSupabaseService.getClient().rpc as jest.Mock).mockResolvedValueOnce({
        data: null,
        error: 'error',
      });

    it('should return users', async () => {
      mockSearchUsersSuccess();

      const result = await service.searchUsers(query);

      expect(result).toEqual(users);
    });

    it('should throw InternalServerErrorException on error', async () => {
      mockSearchUsersError();

      await expect(service.searchUsers(query)).rejects.toThrow(
        'An error occurred while searching users.',
      );
    });
  });
});
