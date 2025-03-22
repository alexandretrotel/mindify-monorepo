import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { mockUsersService } from 'src/common/__mocks__/users.service';

describe('UsersController', () => {
  let usersController: UsersController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    usersController = app.get<UsersController>(UsersController);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchUsers', () => {
    it('should return an array of users', async () => {
      const query = 'test';
      const expected = [{ id: 1, name: 'Test User' }];
      mockUsersService.searchUsers.mockResolvedValueOnce(expected);

      expect(await usersController.searchUsers({ query })).toBe(expected);
      expect(mockUsersService.searchUsers).toHaveBeenCalledWith(query);
    });

    it('should throw an error if the search fails', async () => {
      const query = 'test';
      const error = new Error('Test error');
      mockUsersService.searchUsers.mockRejectedValueOnce(error);

      await expect(usersController.searchUsers({ query })).rejects.toThrow(
        error,
      );
      expect(mockUsersService.searchUsers).toHaveBeenCalledWith(query);
    });
  });
});
