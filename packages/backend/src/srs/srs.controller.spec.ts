import { Test, TestingModule } from '@nestjs/testing';
import { SrsController } from './srs.controller';
import { SrsService } from './srs.service';
import { mockSrsService } from 'src/common/__mocks__/srs.service';

describe('SrsController', () => {
  let srsController: SrsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SrsController],
      providers: [
        {
          provide: SrsService,
          useValue: mockSrsService,
        },
      ],
    }).compile();

    srsController = app.get<SrsController>(SrsController);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateSrsData', () => {
    it('should update SRS data', async () => {
      const result = { success: true };

      mockSrsService.updateSrsData.mockResolvedValueOnce(result);

      expect(
        await srsController.updateSrsData({
          mindId: 1,
          userId: '1',
          grade: 1,
        }),
      ).toBe(result);
    });

    it('should throw an error if an error occurs', async () => {
      mockSrsService.updateSrsData.mockRejectedValueOnce(
        new Error('An error occurred while updating SRS data'),
      );

      await expect(
        srsController.updateSrsData({
          mindId: 1,
          userId: '1',
          grade: 1,
        }),
      ).rejects.toThrow('An error occurred while updating SRS data');
    });
  });

  describe('postUserLearningSession', () => {
    it('should post user learning session', async () => {
      const result = { success: true };

      mockSrsService.postUserLearningSession.mockResolvedValueOnce(result);

      expect(
        await srsController.postUserLearningSession({
          totalTimeInMs: 1,
          totalLength: 1,
          userId: '1',
        }),
      ).toBe(result);
    });

    it('should throw an error if an error occurs', async () => {
      mockSrsService.postUserLearningSession.mockRejectedValueOnce(
        new Error('An error occurred while posting user learning session'),
      );

      await expect(
        srsController.postUserLearningSession({
          totalTimeInMs: 1,
          totalLength: 1,
          userId: '1',
        }),
      ).rejects.toThrow(
        'An error occurred while posting user learning session',
      );
    });
  });

  describe('getSrsData', () => {
    it('should get SRS data', async () => {
      const result = [{ id: 1 }];

      mockSrsService.getSrsData.mockResolvedValueOnce(result);

      expect(await srsController.getSrsData({ userId: '1' })).toBe(result);
    });

    it('should throw an error if an error occurs', async () => {
      mockSrsService.getSrsData.mockRejectedValueOnce(
        new Error('An error occurred while fetching SRS data'),
      );

      await expect(srsController.getSrsData({ userId: '1' })).rejects.toThrow(
        'An error occurred while fetching SRS data',
      );
    });
  });
});
