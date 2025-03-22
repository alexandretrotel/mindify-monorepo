import { Test, TestingModule } from '@nestjs/testing';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { mockTopicService } from 'src/common/__mocks__/topic.service';

describe('TopicController', () => {
  let topicController: TopicController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TopicController],
      providers: [
        {
          provide: TopicService,
          useValue: mockTopicService,
        },
      ],
    }).compile();

    topicController = app.get<TopicController>(TopicController);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTopicName', () => {
    it('should return the topic name', async () => {
      const result = 'topic name';
      jest
        .spyOn(mockTopicService, 'getTopicName')
        .mockResolvedValueOnce(result);

      expect(
        await topicController.getTopicName({
          id: 1,
          languageCode: 'en',
        }),
      ).toBe(result);
    });

    it('should throw an error if the topic name is not found', async () => {
      (mockTopicService.getTopicName as jest.Mock).mockRejectedValueOnce(
        new Error(),
      );

      await expect(
        topicController.getTopicName({
          id: 1,
          languageCode: 'en',
        }),
      ).rejects.toThrow();
    });
  });

  describe('getTopicFromSummaryId', () => {
    it('should return the topic from the summary id', async () => {
      const result = 'topic name';
      jest
        .spyOn(mockTopicService, 'getTopicFromSummaryId')
        .mockResolvedValueOnce(result);

      expect(
        await topicController.getTopicFromSummaryId({
          id: 1,
          languageCode: 'en',
        }),
      ).toBe(result);
    });

    it('should throw an error if the topic is not found', async () => {
      (
        mockTopicService.getTopicFromSummaryId as jest.Mock
      ).mockRejectedValueOnce(new Error());

      await expect(
        topicController.getTopicFromSummaryId({
          id: 1,
          languageCode: 'en',
        }),
      ).rejects.toThrow();
    });
  });
});
