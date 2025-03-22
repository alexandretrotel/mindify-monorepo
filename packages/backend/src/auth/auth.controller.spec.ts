import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UpdatePasswordDto } from '../common/dto/params/auth.dto';
import { mockAuthService } from 'src/common/__mocks__/auth.service';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = app.get<AuthController>(AuthController);
    authService = app.get<AuthService>(AuthService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updatePassword', () => {
    it('should update the user password successfully', async () => {
      const updatePasswordDto: UpdatePasswordDto = {
        newPassword: 'newPassword',
        confirmPassword: 'newPassword',
      };

      (authService.updatePassword as jest.Mock).mockResolvedValueOnce({
        message: 'Password updated successfully',
      });

      const result = await authController.updatePassword(updatePasswordDto);

      expect(result).toEqual({ message: 'Password updated successfully' });
      expect(authService.updatePassword).toHaveBeenCalledWith(
        updatePasswordDto.newPassword,
      );
    });

    it('should throw BadRequestException if passwords do not match', async () => {
      const updatePasswordDto: UpdatePasswordDto = {
        newPassword: 'newPassword',
        confirmPassword: 'wrongPassword',
      };

      await expect(
        authController.updatePassword(updatePasswordDto),
      ).rejects.toThrow(BadRequestException);

      expect(authService.updatePassword).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException if an error occurs during password update', async () => {
      const updatePasswordDto: UpdatePasswordDto = {
        newPassword: 'newPassword',
        confirmPassword: 'newPassword',
      };

      (authService.updatePassword as jest.Mock).mockRejectedValueOnce(
        new InternalServerErrorException('Error'),
      );

      await expect(
        authController.updatePassword(updatePasswordDto),
      ).rejects.toThrow(InternalServerErrorException);

      expect(authService.updatePassword).toHaveBeenCalledWith(
        updatePasswordDto.newPassword,
      );
    });
  });
});
