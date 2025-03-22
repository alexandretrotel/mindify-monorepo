import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { SupabaseService } from '../common/supabase';
import { ConfigService } from '@nestjs/config';
import { mockSupabaseService } from 'src/common/__mocks__/supabase';

jest.spyOn(console, 'error').mockImplementation();

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
        ConfigService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updatePassword', () => {
    const newPassword = 'newPassword';

    const mockUpdateUserSuccess = () =>
      (
        mockSupabaseService.getClient().auth.updateUser as jest.Mock
      ).mockResolvedValueOnce({
        error: null,
      });

    const mockUpdateUserFailure = () =>
      (
        mockSupabaseService.getClient().auth.updateUser as jest.Mock
      ).mockResolvedValueOnce({
        error: 'error',
      });

    it("should update the user's password", async () => {
      mockUpdateUserSuccess();

      const result = await service.updatePassword(newPassword);

      expect(result).toEqual({
        success: true,
        message: 'Password updated successfully',
      });
      expect(
        mockSupabaseService.getClient().auth.updateUser,
      ).toHaveBeenCalledWith({
        password: newPassword,
      });
    });

    it("should throw an error if an error occurs while updating the user's password", async () => {
      mockUpdateUserFailure();

      await expect(service.updatePassword(newPassword)).rejects.toThrow(
        "An error occurred while updating the user's password",
      );
    });
  });
});
