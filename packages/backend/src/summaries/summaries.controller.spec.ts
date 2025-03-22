import { Test, TestingModule } from '@nestjs/testing';
import { SummariesController } from './summaries.controller';
import { SummariesService } from './summaries.service';
import { mockSummariesService } from 'src/common/__mocks__/summaries.service';

describe('SummariesController', () => {
  let summariesController: SummariesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SummariesController],
      providers: [
        {
          provide: SummariesService,
          useValue: mockSummariesService,
        },
      ],
    }).compile();

    summariesController = app.get<SummariesController>(SummariesController);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSummaries', () => {
    it('should return summaries', async () => {
      const languageCode = 'en';
      const result = await summariesController.getSummaries({ languageCode });

      expect(result).toEqual(mockSummariesService.getSummaries(languageCode));
    });

    it('should throw an error', async () => {
      const languageCode = 'en';
      jest
        .spyOn(mockSummariesService, 'getSummaries')
        .mockRejectedValueOnce(new Error());

      await expect(
        summariesController.getSummaries({ languageCode }),
      ).rejects.toThrow();
    });
  });

  describe('getSummariesByIds', () => {
    it('should return summaries by IDs', async () => {
      const languageCodeIdsDto = {
        ids: [1, 2, 3],
        languageCode: 'en',
      };
      const result =
        await summariesController.getSummariesByIds(languageCodeIdsDto);

      expect(result).toEqual(
        mockSummariesService.getSummariesByIds(languageCodeIdsDto),
      );
    });

    it('should throw an error', async () => {
      const languageCodeIdsDto = {
        ids: [1, 2, 3],
        languageCode: 'en',
      };
      jest
        .spyOn(mockSummariesService, 'getSummariesByIds')
        .mockRejectedValueOnce(new Error());

      await expect(
        summariesController.getSummariesByIds(languageCodeIdsDto),
      ).rejects.toThrow();
    });
  });

  describe('searchSummaries', () => {
    it('should return searched summaries', async () => {
      const query = 'query';
      const languageCode = 'en';
      const result = await summariesController.searchSummaries({
        query,
        languageCode,
      });

      expect(result).toEqual(
        mockSummariesService.searchSummaries(query, languageCode),
      );
    });

    it('should throw an error', async () => {
      const query = 'query';
      const languageCode = 'en';
      jest
        .spyOn(mockSummariesService, 'searchSummaries')
        .mockRejectedValueOnce(new Error());

      await expect(
        summariesController.searchSummaries({ query, languageCode }),
      ).rejects.toThrow();
    });
  });

  describe('getSummariesByTopic', () => {
    it('should return summaries by topic', async () => {
      const topicId = 1;
      const languageCode = 'en';
      const result = await summariesController.getSummariesByTopicId({
        topicId,
        languageCode,
      });

      expect(result).toEqual(
        mockSummariesService.getSummariesByTopicId(topicId, languageCode),
      );
    });

    it('should throw an error', async () => {
      const topicId = 1;
      const languageCode = 'en';
      jest
        .spyOn(mockSummariesService, 'getSummariesByTopicId')
        .mockRejectedValueOnce(new Error());

      await expect(
        summariesController.getSummariesByTopicId({ topicId, languageCode }),
      ).rejects.toThrow();
    });
  });

  describe('getBestRatedSummaries', () => {
    it('should return best rated summaries', async () => {
      const languageCode = 'en';
      const result = await summariesController.getBestRatedSummaries({
        languageCode,
      });

      expect(result).toEqual(
        mockSummariesService.getBestRatedSummaries(languageCode),
      );
    });

    it('should throw an error', async () => {
      const languageCode = 'en';
      jest
        .spyOn(mockSummariesService, 'getBestRatedSummaries')
        .mockRejectedValueOnce(new Error());

      await expect(
        summariesController.getBestRatedSummaries({ languageCode }),
      ).rejects.toThrow();
    });
  });

  describe('getReadSummaries', () => {
    it('should return read summaries', async () => {
      const userId = '1';
      const result = await summariesController.getReadSummaries({ userId });

      expect(result).toEqual(mockSummariesService.getReadSummaries(userId));
    });

    it('should throw an error', async () => {
      const userId = '1';
      jest
        .spyOn(mockSummariesService, 'getReadSummaries')
        .mockRejectedValueOnce(new Error());

      await expect(
        summariesController.getReadSummaries({ userId }),
      ).rejects.toThrow();
    });
  });

  describe('getSavedSummaries', () => {
    it('should return saved summaries', async () => {
      const userId = '1';
      const result = await summariesController.getSavedSummaries({ userId });

      expect(result).toEqual(mockSummariesService.getSavedSummaries(userId));
    });

    it('should throw an error', async () => {
      const userId = '1';
      jest
        .spyOn(mockSummariesService, 'getSavedSummaries')
        .mockRejectedValueOnce(new Error());

      await expect(
        summariesController.getSavedSummaries({ userId }),
      ).rejects.toThrow();
    });
  });

  describe('getReadSummariesTimestamps', () => {
    it('should return read summaries timestamps', async () => {
      const userId = '1';
      const result = await summariesController.getReadSummariesTimestamps({
        userId,
      });

      expect(result).toEqual(
        mockSummariesService.getReadSummariesTimestamps(userId),
      );
    });

    it('should throw an error', async () => {
      const userId = '1';
      jest
        .spyOn(mockSummariesService, 'getReadSummariesTimestamps')
        .mockRejectedValueOnce(new Error());

      await expect(
        summariesController.getReadSummariesTimestamps({ userId }),
      ).rejects.toThrow();
    });
  });

  describe('getReadSummariesCount', () => {
    it('should return read summaries count', async () => {
      const userId = '1';
      const result = await summariesController.getReadSummariesCount({
        userId,
      });

      expect(result).toEqual(
        mockSummariesService.getReadSummariesCount(userId),
      );
    });

    it('should throw an error', async () => {
      const userId = '1';
      jest
        .spyOn(mockSummariesService, 'getReadSummariesCount')
        .mockRejectedValueOnce(new Error());

      await expect(
        summariesController.getReadSummariesCount({ userId }),
      ).rejects.toThrow();
    });
  });
});
