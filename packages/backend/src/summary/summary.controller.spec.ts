import { Test, TestingModule } from '@nestjs/testing';
import { SummaryController } from './summary.controller';
import { SummaryService } from './summary.service';
import { mockSummaryService } from 'src/common/__mocks__/summary.service';

describe('SummaryController', () => {
  let summaryController: SummaryController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SummaryController],
      providers: [
        {
          provide: SummaryService,
          useValue: mockSummaryService,
        },
      ],
    }).compile();

    summaryController = app.get<SummaryController>(SummaryController);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSummarySavedCount', () => {
    it('should return the saved count', async () => {
      const summaryId = 1;
      const count = 5;
      mockSummaryService.getSummarySavedCount.mockResolvedValueOnce(count);

      const result = await summaryController.getSummarySavedCount({
        summaryId,
      });

      expect(result).toBe(count);
      expect(mockSummaryService.getSummarySavedCount).toHaveBeenCalledWith(
        summaryId,
      );
    });

    it('should throw an error if the service fails', async () => {
      const summaryId = 1;
      const error = new Error('Test error');
      mockSummaryService.getSummarySavedCount.mockRejectedValueOnce(error);

      await expect(
        summaryController.getSummarySavedCount({ summaryId }),
      ).rejects.toThrow(error);
    });
  });

  describe('getSummaryReadCount', () => {
    it('should return the read count', async () => {
      const summaryId = 1;
      const count = 5;
      mockSummaryService.getSummaryReadCount.mockResolvedValueOnce(count);

      const result = await summaryController.getSummaryReadCount({ summaryId });

      expect(result).toBe(count);
      expect(mockSummaryService.getSummaryReadCount).toHaveBeenCalledWith(
        summaryId,
      );
    });

    it('should throw an error if the service fails', async () => {
      const summaryId = 1;
      const error = new Error('Test error');
      mockSummaryService.getSummaryReadCount.mockRejectedValueOnce(error);

      await expect(
        summaryController.getSummaryReadCount({ summaryId }),
      ).rejects.toThrow(error);
    });
  });

  describe('getSummaryRating', () => {
    it('should return the summary rating', async () => {
      const summaryId = 1;
      const rating = 4;
      mockSummaryService.getSummaryRating.mockResolvedValueOnce(rating);

      const result = await summaryController.getSummaryRating({ summaryId });

      expect(result).toBe(rating);
      expect(mockSummaryService.getSummaryRating).toHaveBeenCalledWith(
        summaryId,
      );
    });

    it('should throw an error if the service fails', async () => {
      const summaryId = 1;
      const error = new Error('Test error');
      mockSummaryService.getSummaryRating.mockRejectedValueOnce(error);

      await expect(
        summaryController.getSummaryRating({ summaryId }),
      ).rejects.toThrow(error);
    });
  });

  describe('getSummary', () => {
    it('should return the summary', async () => {
      const summaryId = 1;
      const languageCode = 'en';
      const summary = { id: summaryId, languageCode };
      mockSummaryService.getSummary.mockResolvedValueOnce(summary);

      const result = await summaryController.getSummary({
        id: summaryId,
        languageCode,
      });

      expect(result).toBe(summary);
      expect(mockSummaryService.getSummary).toHaveBeenCalledWith(
        summaryId,
        languageCode,
      );
    });

    it('should throw an error if the service fails', async () => {
      const summaryId = 1;
      const languageCode = 'en';
      const error = new Error('Test error');
      mockSummaryService.getSummary.mockRejectedValueOnce(error);

      await expect(
        summaryController.getSummary({ id: summaryId, languageCode }),
      ).rejects.toThrow(error);
    });
  });

  describe('rateSummary', () => {
    it('should rate the summary', async () => {
      const userId = 'user1';
      const summaryId = 1;
      const rating = 4;
      mockSummaryService.rateSummary.mockResolvedValueOnce({
        success: true,
      });

      await summaryController.rateSummary({
        userId,
        summaryId,
        rating,
      });

      expect(mockSummaryService.rateSummary).toHaveBeenCalledWith(
        userId,
        summaryId,
        rating,
      );
    });

    it('should throw an error if the service fails', async () => {
      const userId = 'user1';
      const summaryId = 1;
      const rating = 4;
      const error = new Error('Test error');
      mockSummaryService.rateSummary.mockRejectedValueOnce(error);

      await expect(
        summaryController.rateSummary({ userId, summaryId, rating }),
      ).rejects.toThrow(error);
    });
  });

  describe('saveSummary', () => {
    it('should save the summary', async () => {
      const userId = 'user1';
      const summaryId = 1;
      const languageCode = 'en';
      mockSummaryService.saveSummary.mockResolvedValueOnce({
        success: true,
      });

      await summaryController.saveSummary({
        userId,
        summaryId,
        languageCode,
      });

      expect(mockSummaryService.saveSummary).toHaveBeenCalledWith(
        userId,
        summaryId,
        languageCode,
      );
    });

    it('should throw an error if the service fails', async () => {
      const userId = 'user1';
      const summaryId = 1;
      const languageCode = 'en';
      const error = new Error('Test error');
      mockSummaryService.saveSummary.mockRejectedValueOnce(error);

      await expect(
        summaryController.saveSummary({ userId, summaryId, languageCode }),
      ).rejects.toThrow(error);
    });
  });

  describe('unsaveSummary', () => {
    it('should unsave the summary', async () => {
      const userId = 'user1';
      const summaryId = 1;
      mockSummaryService.unsaveSummary.mockResolvedValueOnce({
        success: true,
      });

      await summaryController.unsaveSummary({ userId, summaryId });

      expect(mockSummaryService.unsaveSummary).toHaveBeenCalledWith(
        userId,
        summaryId,
      );
    });

    it('should throw an error if the service fails', async () => {
      const userId = 'user1';
      const summaryId = 1;
      const error = new Error('Test error');
      mockSummaryService.unsaveSummary.mockRejectedValueOnce(error);

      await expect(
        summaryController.unsaveSummary({ userId, summaryId }),
      ).rejects.toThrow(error);
    });
  });

  describe('markSummaryAsRead', () => {
    it('should mark the summary as read', async () => {
      const userId = 'user1';
      const summaryId = 1;
      const languageCode = 'en';
      mockSummaryService.markSummaryAsRead.mockResolvedValueOnce({
        success: true,
      });

      await summaryController.markSummaryAsRead({
        userId,
        summaryId,
        languageCode,
      });

      expect(mockSummaryService.markSummaryAsRead).toHaveBeenCalledWith(
        userId,
        summaryId,
        languageCode,
      );
    });

    it('should throw an error if the service fails', async () => {
      const userId = 'user1';
      const summaryId = 1;
      const languageCode = 'en';
      const error = new Error('Test error');
      mockSummaryService.markSummaryAsRead.mockRejectedValueOnce(error);

      await expect(
        summaryController.markSummaryAsRead({
          userId,
          summaryId,
          languageCode,
        }),
      ).rejects.toThrow(error);
    });
  });

  describe('markSummaryAsUnread', () => {
    it('should mark the summary as unread', async () => {
      const userId = 'user1';
      const summaryId = 1;
      mockSummaryService.markSummaryAsUnread.mockResolvedValueOnce({
        success: true,
      });

      await summaryController.markSummaryAsUnread({ userId, summaryId });

      expect(mockSummaryService.markSummaryAsUnread).toHaveBeenCalledWith(
        userId,
        summaryId,
      );
    });

    it('should throw an error if the service fails', async () => {
      const userId = 'user1';
      const summaryId = 1;
      const error = new Error('Test error');
      mockSummaryService.markSummaryAsUnread.mockRejectedValueOnce(error);

      await expect(
        summaryController.markSummaryAsUnread({ userId, summaryId }),
      ).rejects.toThrow(error);
    });
  });

  describe('isSummarySaved', () => {
    it('should check if the summary is saved', async () => {
      const userId = 'user1';
      const summaryId = 1;
      mockSummaryService.isSummarySaved.mockResolvedValueOnce(true);

      const result = await summaryController.isSummarySaved({
        userId,
        summaryId,
      });

      expect(result).toBe(true);
      expect(mockSummaryService.isSummarySaved).toHaveBeenCalledWith(
        userId,
        summaryId,
      );
    });

    it('should throw an error if the service fails', async () => {
      const userId = 'user1';
      const summaryId = 1;
      const error = new Error('Test error');
      mockSummaryService.isSummarySaved.mockRejectedValueOnce(error);

      await expect(
        summaryController.isSummarySaved({ userId, summaryId }),
      ).rejects.toThrow(error);
    });
  });

  describe('isSummaryRead', () => {
    it('should check if the summary is read', async () => {
      const userId = 'user1';
      const summaryId = 1;
      mockSummaryService.isSummaryRead.mockResolvedValueOnce(true);

      const result = await summaryController.isSummaryRead({
        userId,
        summaryId,
      });

      expect(result).toBe(true);
      expect(mockSummaryService.isSummaryRead).toHaveBeenCalledWith(
        userId,
        summaryId,
      );
    });

    it('should throw an error if the service fails', async () => {
      const userId = 'user1';
      const summaryId = 1;
      const error = new Error('Test error');
      mockSummaryService.isSummaryRead.mockRejectedValueOnce(error);

      await expect(
        summaryController.isSummaryRead({ userId, summaryId }),
      ).rejects.toThrow(error);
    });
  });

  describe('getUserSummaryRating', () => {
    it('should return the user summary rating', async () => {
      const userId = 'user1';
      const summaryId = 1;
      const rating = 4;
      mockSummaryService.getUserSummaryRating.mockResolvedValueOnce(rating);

      const result = await summaryController.getUserSummaryRating({
        userId,
        summaryId,
      });

      expect(result).toBe(rating);
      expect(mockSummaryService.getUserSummaryRating).toHaveBeenCalledWith(
        userId,
        summaryId,
      );
    });

    it('should throw an error if the service fails', async () => {
      const userId = 'user1';
      const summaryId = 1;
      const error = new Error('Test error');
      mockSummaryService.getUserSummaryRating.mockRejectedValueOnce(error);

      await expect(
        summaryController.getUserSummaryRating({ userId, summaryId }),
      ).rejects.toThrow(error);
    });
  });

  describe('getSummaryTitle', () => {
    it('should return the summary title', async () => {
      const id = 1;
      const languageCode = 'en';
      const title = 'Test title';
      mockSummaryService.getSummaryTitle.mockResolvedValueOnce(title);

      const result = await summaryController.getSummaryTitle({
        id,
        languageCode,
      });

      expect(result).toBe(title);
      expect(mockSummaryService.getSummaryTitle).toHaveBeenCalledWith(
        id,
        languageCode,
      );
    });

    it('should throw an error if the service fails', async () => {
      const id = 1;
      const languageCode = 'en';
      const error = new Error('Test error');
      mockSummaryService.getSummaryTitle.mockRejectedValueOnce(error);

      await expect(
        summaryController.getSummaryTitle({ id, languageCode }),
      ).rejects.toThrow(error);
    });
  });
});
