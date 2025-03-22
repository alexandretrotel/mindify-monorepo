import { Test, TestingModule } from '@nestjs/testing';
import { TopicsService } from './topics.service';
import { SupabaseService } from '../common/supabase';
import { ConfigService } from '@nestjs/config';
import { mockSupabaseService } from 'src/common/__mocks__/supabase';
import { InternalServerErrorException } from '@nestjs/common';

jest.spyOn(console, 'error').mockImplementation(() => null);

describe('TopicsService', () => {
  let service: TopicsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TopicsService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
        ConfigService,
      ],
    }).compile();

    service = module.get<TopicsService>(TopicsService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTopics', () => {
    const languageCode = 'en';
    const topics = ['topic1', 'topic2'];

    const mockGetTopicsSuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('topic_translations')
          .select('*, topics(production)').match as jest.Mock
      ).mockResolvedValueOnce({
        error: null,
        data: topics,
      });

    const mockGetTopicsError = () =>
      (
        mockSupabaseService
          .getClient()
          .from('topic_translations')
          .select('*, topics(production)').match as jest.Mock
      ).mockResolvedValueOnce({
        error: new Error(),
        data: null,
      });

    it('should return topics', async () => {
      mockGetTopicsSuccess();

      const result = await service.getTopics(languageCode);

      expect(result).toEqual(topics);
    });

    it('should throw an error', async () => {
      mockGetTopicsError();

      await expect(service.getTopics(languageCode)).rejects.toThrow();
    });
  });

  describe('getTopicsByIds', () => {
    const languageCode = 'en';
    const ids = [1, 2];
    const topics = ['topic1', 'topic2'];

    const mockGetTopicsByIdsSuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('topic_translations')
          .select('*')
          .eq('language_code', languageCode).in as jest.Mock
      ).mockResolvedValueOnce({
        error: null,
        data: topics,
      });

    const mockGetTopicsByIdsNotFound = () =>
      (
        mockSupabaseService
          .getClient()
          .from('topic_translations')
          .select('*')
          .eq('language_code', languageCode).in as jest.Mock
      ).mockResolvedValueOnce({
        error: null,
        data: null,
      });

    const mockGetTopicsByIdsError = () =>
      (
        mockSupabaseService
          .getClient()
          .from('topic_translations')
          .select('*')
          .eq('language_code', languageCode).in as jest.Mock
      ).mockResolvedValueOnce({
        error: new Error(),
        data: null,
      });

    it('should return topics', async () => {
      mockGetTopicsByIdsSuccess();

      const result = await service.getTopicsByIds(ids, languageCode);

      expect(result).toEqual(topics);
    });

    it("should return an empty array if there's no data", async () => {
      mockGetTopicsByIdsNotFound();

      const result = await service.getTopicsByIds(ids, languageCode);

      expect(result).toEqual([]);
    });

    it('should throw an error', async () => {
      mockGetTopicsByIdsError();

      await expect(service.getTopicsByIds(ids, languageCode)).rejects.toThrow();
    });
  });

  describe('getTopicsByUserId', () => {
    const languageCode = 'en';
    const user_id = '1';
    const topics = ['topic1', 'topic2'];

    const mockGetTopicsByUserIdSuccess = () =>
      (
        mockSupabaseService.getClient().from('user_topics').select('topics(id)')
          .match as jest.Mock
      ).mockResolvedValueOnce({
        error: null,
        data: [{ topics: { id: 1 } }, { topics: { id: 2 } }],
      });

    const mockGetTopicsByUserIdError = () =>
      (
        mockSupabaseService.getClient().from('user_topics').select('topics(id)')
          .match as jest.Mock
      ).mockResolvedValueOnce({
        error: new Error(),
        data: null,
      });

    it('should return topics', async () => {
      mockGetTopicsByUserIdSuccess();
      service.getTopicsByIds = jest.fn().mockResolvedValueOnce(topics);

      const result = await service.getTopicsByUserId(user_id, languageCode);

      expect(result).toEqual(topics);
    });

    it('should throw an error', async () => {
      mockGetTopicsByUserIdError();

      await expect(
        service.getTopicsByUserId(user_id, languageCode),
      ).rejects.toThrow();
    });

    it('should return an empty array if there are no topics', async () => {
      mockGetTopicsByUserIdSuccess();

      const result = await service.getTopicsByUserId(user_id, languageCode);

      expect(result).toEqual([]);
    });
  });

  describe('getTopicsCountByUserId', () => {
    const userId = '1';
    const count = 2;

    const mockGetTopicsCountByUserIdSuccess = () =>
      (
        mockSupabaseService.getClient().from('user_topics').select('count(*)')
          .match as jest.Mock
      ).mockResolvedValueOnce({
        error: null,
        count,
      });

    const mockGetTopicsCountByUserIdError = () =>
      (
        mockSupabaseService.getClient().from('user_topics').select('count(*)')
          .match as jest.Mock
      ).mockResolvedValueOnce({
        error: new Error(),
        data: null,
      });

    it('should return the count', async () => {
      mockGetTopicsCountByUserIdSuccess();

      const result = await service.getTopicsCountByUserId(userId);

      expect(result).toEqual({ count });
    });

    it('should throw an error', async () => {
      mockGetTopicsCountByUserIdError();

      await expect(service.getTopicsCountByUserId(userId)).rejects.toThrow();
    });
  });

  describe('updateUserTopics', () => {
    const userId = 'user1';
    const selectedTopics = [1, 2];

    const mockUpdateUserTopicsSuccess = () =>
      (
        mockSupabaseService.getClient().from('user_topics').select('topics(id)')
          .eq as jest.Mock
      ).mockResolvedValueOnce({
        error: null,
        data: [{ topics: { id: 1 } }, { topics: { id: 2 } }],
      });

    const mockUpdateUserTopicsError = () =>
      (
        mockSupabaseService.getClient().from('user_topics').select('topics(id)')
          .eq as jest.Mock
      ).mockResolvedValueOnce({
        error: new Error("Couldn't update user topics."),
        data: null,
      });

    const mockUpdateUserTopicsDeleteSuccess = () =>
      (
        mockSupabaseService.getClient().from('user_topics').delete()
          .in as jest.Mock
      ).mockResolvedValueOnce({
        error: null,
        data: selectedTopics,
      });

    const mockUpdateUserTopicsDeleteError = () =>
      (
        mockSupabaseService.getClient().from('user_topics').delete()
          .in as jest.Mock
      ).mockResolvedValueOnce({
        error: new Error("Couldn't delete user topics."),
        data: null,
      });

    const mockUpdateUserTopicsInsertSuccess = () =>
      (
        mockSupabaseService.getClient().from('user_topics').insert as jest.Mock
      ).mockResolvedValueOnce({
        error: null,
        data: selectedTopics,
      });

    const mockUpdateUserTopicsInsertError = () =>
      (
        mockSupabaseService.getClient().from('user_topics').insert as jest.Mock
      ).mockResolvedValueOnce({
        error: new Error("Couldn't insert user topics."),
        data: null,
      });

    it("should throw an error if it couldn't insert the user topics", async () => {
      (
        mockSupabaseService.getClient().from('user_topics').select('topics(id)')
          .eq as jest.Mock
      ).mockResolvedValueOnce({
        error: null,
        data: [{ topics: { id: 1 } }],
      });
      mockUpdateUserTopicsInsertError();

      await expect(service.updateUserTopics(userId, [1, 2])).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(
        mockSupabaseService.getClient().from('user_topics').insert,
      ).toHaveBeenCalled();
    });

    it('should update the user topics', async () => {
      mockUpdateUserTopicsSuccess();
      mockUpdateUserTopicsDeleteSuccess();
      mockUpdateUserTopicsInsertSuccess();

      const result = await service.updateUserTopics(userId, selectedTopics);

      expect(result).toEqual({
        success: true,
        message: 'Topics updated successfully.',
      });
    });

    it("should delete the user topics if there's no selected topics", async () => {
      mockUpdateUserTopicsSuccess();
      mockUpdateUserTopicsDeleteSuccess();

      const result = await service.updateUserTopics(userId, []);

      expect(result).toEqual({
        success: true,
        message: 'Topics updated successfully.',
      });
    });

    it("should not change the user topics if there's no difference", async () => {
      mockUpdateUserTopicsSuccess();

      const result = await service.updateUserTopics(userId, selectedTopics);

      expect(result).toEqual({
        success: true,
        message: 'Topics updated successfully.',
      });
    });

    it('should throw an error if fetching user topics fails', async () => {
      mockUpdateUserTopicsError();

      await expect(
        service.updateUserTopics(userId, selectedTopics),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('should return success if there are no selected topics', async () => {
      mockUpdateUserTopicsSuccess();

      const result = await service.updateUserTopics(userId, []);

      expect(result).toEqual({
        success: true,
        message: 'Topics updated successfully.',
      });
    });

    it('should throw an error if it could not delete the user topics', async () => {
      mockUpdateUserTopicsSuccess();
      mockUpdateUserTopicsDeleteError();

      await expect(service.updateUserTopics(userId, [])).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getSummariesCountByTopic', () => {
    const topics = [{ topic_id: 1 }, { topic_id: 2 }, { topic_id: 1 }];

    const mockGetSummariesCountByTopicSuccess = () =>
      (
        mockSupabaseService.getClient().from('summaries').select('topic_id')
          .eq as jest.Mock
      ).mockResolvedValueOnce({
        error: null,
        data: topics,
      });

    const mockGetSummariesCountByTopicError = () =>
      (
        mockSupabaseService.getClient().from('summaries').select('topic_id')
          .eq as jest.Mock
      ).mockResolvedValueOnce({
        error: new Error(),
        data: null,
      });

    it('should return the summaries count by topic', async () => {
      mockGetSummariesCountByTopicSuccess();

      const result = await service.getSummariesCountByTopic();

      expect(result).toEqual([
        { topicId: 1, count: 2 },
        { topicId: 2, count: 1 },
      ]);
    });

    it('should throw an error', async () => {
      mockGetSummariesCountByTopicError();

      await expect(service.getSummariesCountByTopic()).rejects.toThrow();
    });
  });

  describe('getUserTopicsProgression', () => {
    const userId = '1';
    const topicsProgression = [
      { summaries: { topics: { id: 1 } } },
      { summaries: { topics: { id: 2 } } },
      { summaries: { topics: { id: 1 } } },
    ];

    const mockGetUserTopicsProgressionSuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('read_summaries')
          .select('summaries(*, topics(*))').match as jest.Mock
      ).mockResolvedValueOnce({
        error: null,
        data: topicsProgression,
      });

    const mockGetUserTopicsProgressionNotFound = () =>
      (
        mockSupabaseService
          .getClient()
          .from('read_summaries')
          .select('summaries(*, topics(*))').match as jest.Mock
      ).mockResolvedValueOnce({
        error: null,
        data: null,
      });

    const mockGetUserTopicsProgressionError = () =>
      (
        mockSupabaseService
          .getClient()
          .from('read_summaries')
          .select('summaries(*, topics(*))').match as jest.Mock
      ).mockResolvedValueOnce({
        error: new Error(),
        data: null,
      });

    it('should return the user topics progression', async () => {
      mockGetUserTopicsProgressionSuccess();
      service.getSummariesCountByTopic = jest.fn().mockResolvedValueOnce([
        { topicId: 1, count: 2 },
        { topicId: 2, count: 1 },
      ]);

      const result = await service.getUserTopicsProgression(userId);

      expect(result).toEqual([
        { count: 2, topicId: 1, total: 2 },
        { count: 1, topicId: 2, total: 1 },
      ]);
    });

    it('should throw an error', async () => {
      mockGetUserTopicsProgressionError();

      await expect(service.getUserTopicsProgression(userId)).rejects.toThrow();
    });

    it('should return an empty object if there are no topics', async () => {
      mockGetUserTopicsProgressionNotFound();
      service.getSummariesCountByTopic = jest.fn().mockResolvedValueOnce({});

      const result = await service.getUserTopicsProgression(userId);

      expect(result).toEqual([]);
    });
  });
});
