import { Test, TestingModule } from '@nestjs/testing';
import { MindController } from './mind.controller';
import { MindService } from './mind.service';
import { mockMindService } from 'src/common/__mocks__/mind.service';

describe('MindController', () => {
  let mindController: MindController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MindController],
      providers: [
        {
          provide: MindService,
          useValue: mockMindService,
        },
      ],
    }).compile();

    mindController = app.get<MindController>(MindController);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveMind', () => {
    const userId = 'userId';
    const mindId = 1;

    const mockSaveMindSuccess = () =>
      (mockMindService.saveMind as jest.Mock).mockResolvedValueOnce({
        message: 'The mind has been saved successfully.',
      });

    const mockSaveMindFailure = () =>
      (mockMindService.saveMind as jest.Mock).mockRejectedValueOnce(
        new Error('error'),
      );

    it('should save the mind', async () => {
      mockSaveMindSuccess();

      const result = await mindController.saveMind({
        userId,
        mindId,
      });

      expect(result).toEqual({
        message: 'The mind has been saved successfully.',
      });
      expect(mockMindService.saveMind).toHaveBeenCalledWith(userId, mindId);
    });

    it('should throw an error if the mind has not been saved', async () => {
      mockSaveMindFailure();

      await expect(mindController.saveMind({ userId, mindId })).rejects.toThrow(
        new Error('error'),
      );
    });
  });

  describe('unsaveMind', () => {
    const userId = 'userId';
    const mindId = 1;

    const mockUnsaveMindSuccess = () =>
      (mockMindService.unsaveMind as jest.Mock).mockResolvedValueOnce({
        message: 'The mind has been unsaved successfully.',
      });

    const mockUnsaveMindFailure = () =>
      (mockMindService.unsaveMind as jest.Mock).mockRejectedValueOnce(
        new Error('error'),
      );

    it('should unsave the mind', async () => {
      mockUnsaveMindSuccess();

      const result = await mindController.unsaveMind({
        userId,
        mindId,
      });

      expect(result).toEqual({
        message: 'The mind has been unsaved successfully.',
      });
      expect(mockMindService.unsaveMind).toHaveBeenCalledWith(userId, mindId);
    });

    it('should throw an error if the mind has not been unsaved', async () => {
      mockUnsaveMindFailure();

      await expect(
        mindController.unsaveMind({ userId, mindId }),
      ).rejects.toThrow(new Error('error'));
    });
  });

  describe('likeMind', () => {
    const userId = 'userId';
    const mindId = 1;

    const mockLikeMindSuccess = () =>
      (mockMindService.likeMind as jest.Mock).mockResolvedValueOnce({
        message: 'The mind has been liked successfully.',
      });

    const mockLikeMindFailure = () =>
      (mockMindService.likeMind as jest.Mock).mockRejectedValueOnce(
        new Error('error'),
      );

    it('should like the mind', async () => {
      mockLikeMindSuccess();

      const result = await mindController.likeMind({
        userId,
        mindId,
      });

      expect(result).toEqual({
        message: 'The mind has been liked successfully.',
      });
      expect(mockMindService.likeMind).toHaveBeenCalledWith(userId, mindId);
    });

    it('should throw an error if the mind has not been liked', async () => {
      mockLikeMindFailure();

      await expect(mindController.likeMind({ userId, mindId })).rejects.toThrow(
        new Error('error'),
      );
    });
  });

  describe('unlikeMind', () => {
    const userId = 'userId';
    const mindId = 1;

    const mockUnlikeMindSuccess = () =>
      (mockMindService.unlikeMind as jest.Mock).mockResolvedValueOnce({
        message: 'The mind has been unliked successfully.',
      });

    const mockUnlikeMindFailure = () =>
      (mockMindService.unlikeMind as jest.Mock).mockRejectedValueOnce(
        new Error('error'),
      );

    it('should unlike the mind', async () => {
      mockUnlikeMindSuccess();

      const result = await mindController.unlikeMind({
        userId,
        mindId,
      });

      expect(result).toEqual({
        message: 'The mind has been unliked successfully.',
      });
      expect(mockMindService.unlikeMind).toHaveBeenCalledWith(userId, mindId);
    });

    it('should throw an error if the mind has not been unliked', async () => {
      mockUnlikeMindFailure();

      await expect(
        mindController.unlikeMind({ userId, mindId }),
      ).rejects.toThrow(new Error('error'));
    });
  });

  describe('isMindSaved', () => {
    const userId = 'userId';
    const mindId = 1;

    const mockIsMindSavedSuccess = () =>
      (mockMindService.isMindSaved as jest.Mock).mockResolvedValueOnce(true);

    const mockIsMindSavedFailure = () =>
      (mockMindService.isMindSaved as jest.Mock).mockRejectedValueOnce(
        new Error('error'),
      );

    it('should check if the mind is saved', async () => {
      mockIsMindSavedSuccess();

      const result = await mindController.isMindSaved({
        userId,
        mindId,
      });

      expect(result).toBe(true);
      expect(mockMindService.isMindSaved).toHaveBeenCalledWith(userId, mindId);
    });

    it('should throw an error if the check fails', async () => {
      mockIsMindSavedFailure();

      await expect(
        mindController.isMindSaved({ userId, mindId }),
      ).rejects.toThrow(new Error('error'));
    });
  });

  describe('isMindLiked', () => {
    const userId = 'userId';
    const mindId = 1;

    const mockIsMindLikedSuccess = () =>
      (mockMindService.isMindLiked as jest.Mock).mockResolvedValueOnce(true);

    const mockIsMindLikedFailure = () =>
      (mockMindService.isMindLiked as jest.Mock).mockRejectedValueOnce(
        new Error('error'),
      );

    it('should check if the mind is liked', async () => {
      mockIsMindLikedSuccess();

      const result = await mindController.isMindLiked({
        userId,
        mindId,
      });

      expect(result).toBe(true);
      expect(mockMindService.isMindLiked).toHaveBeenCalledWith(userId, mindId);
    });

    it('should throw an error if the check fails', async () => {
      mockIsMindLikedFailure();

      await expect(
        mindController.isMindLiked({ userId, mindId }),
      ).rejects.toThrow(new Error('error'));
    });
  });

  describe('getSavedMindCount', () => {
    const mindId = 1;

    const mockGetSavedCountSuccess = () =>
      (mockMindService.getSavedMindCount as jest.Mock).mockResolvedValueOnce(1);

    const mockGetSavedCountFailure = () =>
      (mockMindService.getSavedMindCount as jest.Mock).mockRejectedValueOnce(
        new Error('error'),
      );

    it('should get the saved count', async () => {
      mockGetSavedCountSuccess();

      const result = await mindController.getSavedMindCount({ mindId });

      expect(result).toBe(1);
      expect(mockMindService.getSavedMindCount).toHaveBeenCalledWith(mindId);
    });

    it('should throw an error if the count fails', async () => {
      mockGetSavedCountFailure();

      await expect(
        mindController.getSavedMindCount({ mindId }),
      ).rejects.toThrow(new Error('error'));
    });
  });

  describe('getLikedMindCount', () => {
    const mindId = 1;

    const mockGetLikedCountSuccess = () =>
      (mockMindService.getLikedMindCount as jest.Mock).mockResolvedValueOnce(1);

    const mockGetLikedCountFailure = () =>
      (mockMindService.getLikedMindCount as jest.Mock).mockRejectedValueOnce(
        new Error('error'),
      );

    it('should get the liked count', async () => {
      mockGetLikedCountSuccess();

      const result = await mindController.getLikedMindCount({ mindId });

      expect(result).toBe(1);
      expect(mockMindService.getLikedMindCount).toHaveBeenCalledWith(mindId);
    });

    it('should throw an error if the count fails', async () => {
      mockGetLikedCountFailure();

      await expect(
        mindController.getLikedMindCount({ mindId }),
      ).rejects.toThrow(new Error('error'));
    });
  });
});
