import { Test, TestingModule } from '@nestjs/testing';
import { TopicsController } from './topics.controller';
import { TopicsService } from './topics.service';
import { mockTopicsService } from 'src/common/__mocks__/topics.service';

describe('TopicsController', () => {
  let topicsController: TopicsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TopicsController],
      providers: [
        {
          provide: TopicsService,
          useValue: mockTopicsService,
        },
      ],
    }).compile();

    topicsController = app.get<TopicsController>(TopicsController);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTopics', () => {
    it('should return all topics', async () => {
      const result = ['topic1', 'topic2'];
      jest.spyOn(mockTopicsService, 'getTopics').mockResolvedValueOnce(result);

      expect(await topicsController.getTopics({ languageCode: 'en' })).toBe(
        result,
      );
    });

    it('should throw an error if the topics are not found', async () => {
      (mockTopicsService.getTopics as jest.Mock).mockRejectedValueOnce(
        new Error(),
      );

      await expect(
        topicsController.getTopics({ languageCode: 'en' }),
      ).rejects.toThrow();
    });
  });

  describe('getTopicsByIds', () => {
    it('should return topics by ids', async () => {
      const result = ['topic1', 'topic2'];
      jest
        .spyOn(mockTopicsService, 'getTopicsByIds')
        .mockResolvedValueOnce(result);

      expect(
        await topicsController.getTopicsByIds({
          ids: [1, 2],
          languageCode: 'en',
        }),
      ).toBe(result);
    });

    it('should throw an error if the topics by ids are not found', async () => {
      (mockTopicsService.getTopicsByIds as jest.Mock).mockRejectedValueOnce(
        new Error(),
      );

      await expect(
        topicsController.getTopicsByIds({
          ids: [1, 2],
          languageCode: 'en',
        }),
      ).rejects.toThrow();
    });
  });

  describe('getTopicsByUserId', () => {
    it('should return topics by user id', async () => {
      const result = ['topic1', 'topic2'];
      jest
        .spyOn(mockTopicsService, 'getTopicsByUserId')
        .mockResolvedValueOnce(result);

      expect(
        await topicsController.getTopicsByUserId({
          userId: '1',
          languageCode: 'en',
        }),
      ).toBe(result);
    });

    it('should throw an error if the topics by user id are not found', async () => {
      (mockTopicsService.getTopicsByUserId as jest.Mock).mockRejectedValueOnce(
        new Error(),
      );

      await expect(
        topicsController.getTopicsByUserId({
          userId: '1',
          languageCode: 'en',
        }),
      ).rejects.toThrow();
    });
  });

  describe('getTopicsCountByUserId', () => {
    it('should return the topics count by user id', async () => {
      const result = 2;
      jest
        .spyOn(mockTopicsService, 'getTopicsCountByUserId')
        .mockResolvedValueOnce(result);

      expect(
        await topicsController.getTopicsCountByUserId({ userId: '1' }),
      ).toBe(result);
    });

    it('should throw an error if the topics count by user id is not found', async () => {
      (
        mockTopicsService.getTopicsCountByUserId as jest.Mock
      ).mockRejectedValueOnce(new Error());

      await expect(
        topicsController.getTopicsCountByUserId({ userId: '1' }),
      ).rejects.toThrow();
    });
  });

  describe('updateUserTopics', () => {
    it('should update user topics', async () => {
      const result = ['topic1', 'topic2'];
      jest
        .spyOn(mockTopicsService, 'updateUserTopics')
        .mockResolvedValueOnce(result);

      expect(
        await topicsController.updateUserTopics({
          userId: '1',
          selectedTopics: [1, 2],
        }),
      ).toBe(result);
    });

    it('should throw an error if the user topics are not updated', async () => {
      (mockTopicsService.updateUserTopics as jest.Mock).mockRejectedValueOnce(
        new Error(),
      );

      await expect(
        topicsController.updateUserTopics({
          userId: '1',
          selectedTopics: [1, 2],
        }),
      ).rejects.toThrow();
    });
  });

  describe('getUserTopicsProgression', () => {
    it('should return the user topics progression', async () => {
      const result = ['topic1', 'topic2'];
      jest
        .spyOn(mockTopicsService, 'getUserTopicsProgression')
        .mockResolvedValueOnce(result);

      expect(
        await topicsController.getUserTopicsProgression({ userId: '1' }),
      ).toBe(result);
    });

    it('should throw an error if the user topics progression is not found', async () => {
      (
        mockTopicsService.getUserTopicsProgression as jest.Mock
      ).mockRejectedValueOnce(new Error());

      await expect(
        topicsController.getUserTopicsProgression({ userId: '1' }),
      ).rejects.toThrow();
    });
  });

  describe('getSummariesCountByTopic', () => {
    it('should return the summaries count by topic', async () => {
      const result = 2;
      jest
        .spyOn(mockTopicsService, 'getSummariesCountByTopic')
        .mockResolvedValueOnce(result);

      expect(await topicsController.getSummariesCountByTopic()).toBe(result);
    });

    it('should throw an error if the summaries count by topic is not found', async () => {
      (
        mockTopicsService.getSummariesCountByTopic as jest.Mock
      ).mockRejectedValueOnce(new Error());

      await expect(
        topicsController.getSummariesCountByTopic(),
      ).rejects.toThrow();
    });
  });
});
