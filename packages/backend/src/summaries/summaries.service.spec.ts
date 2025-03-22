import { Test, TestingModule } from '@nestjs/testing';
import { SummariesService } from './summaries.service';
import { SupabaseService } from '../common/supabase';
import { ConfigService } from '@nestjs/config';
import { AuthorService } from 'src/author/author.service';
import { TopicService } from 'src/topic/topic.service';
import { mockSupabaseService } from 'src/common/__mocks__/supabase';
import { mockAuthorService } from 'src/common/__mocks__/author.service';
import { mockTopicService } from 'src/common/__mocks__/topic.service';
import { ChaptersService } from 'src/chapters/chapters.service';
import { mockChaptersService } from 'src/common/__mocks__/chapters.service';

jest.spyOn(console, 'error').mockImplementation(() => null);

describe('SummariesService', () => {
  let service: SummariesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SummariesService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
        ConfigService,
        {
          provide: AuthorService,
          useValue: mockAuthorService,
        },
        {
          provide: TopicService,
          useValue: mockTopicService,
        },
        { provide: ChaptersService, useValue: mockChaptersService },
      ],
    }).compile();

    service = module.get<SummariesService>(SummariesService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSummaries', () => {
    const languageCode = 'en';
    const summaries = {
      id: 1,
      image_url: 'image',
      source_type: 'type',
      source_url: 'url',
      reading_time: 10,
      created_at: '2021-08-01T00:00:00.000Z',
      authors: { name: 'author', description: 'description' },
      topics: { name: 'topic' },
    };
    const summariesResult = {
      id: 1,
      title: 'title',
      image_url: 'image',
      source_type: 'type',
      source_url: 'url',
      reading_time: 10,
      created_at: '2021-08-01T00:00:00.000Z',
      author_name: 'author',
      author_description: 'description',
      topic_name: 'topic',
    };

    const mockGetSummariesSuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('summary_translations')
          .select(
            'title, summaries(id, image_url, source_type, source_url, reading_time, created_at, authors(name, description), topics(name))',
          )
          .eq('summaries.production', true).order as jest.Mock
      ).mockResolvedValueOnce({ data: [{ title: 'title', summaries }] });

    const mockGetSummariesError = () =>
      (
        mockSupabaseService
          .getClient()
          .from('summary_translations')
          .select(
            'title, summaries(id, image_url, source_type, source_url, reading_time, created_at, authors(name, description), topics(name))',
          )
          .eq('summaries.production', true).order as jest.Mock
      ).mockResolvedValueOnce({ error: 'error' });

    const mockGetAuthorFromSummaryId = () =>
      (
        mockAuthorService.getAuthorFromSummaryId as jest.Mock
      ).mockResolvedValueOnce({ name: 'author', description: 'description' });

    const mockGetTopicFromSummaryId = () =>
      (
        mockTopicService.getTopicFromSummaryId as jest.Mock
      ).mockResolvedValueOnce({ name: 'topic' });

    const mockGetAuthorFromSummaryIdError = () =>
      (
        mockAuthorService.getAuthorFromSummaryId as jest.Mock
      ).mockRejectedValueOnce(new Error('error'));

    it('should return summaries', async () => {
      mockGetSummariesSuccess();
      mockGetAuthorFromSummaryId();
      mockGetTopicFromSummaryId();

      const result = await service.getSummaries(languageCode);
      expect(result).toEqual([summariesResult]);
    });

    it('should throw an error', async () => {
      mockGetSummariesError();

      await expect(service.getSummaries(languageCode)).rejects.toThrow();
    });

    it("should throw an error if author's data is not available", async () => {
      mockGetSummariesSuccess();
      mockGetAuthorFromSummaryIdError();
      mockGetTopicFromSummaryId();

      await expect(service.getSummaries(languageCode)).rejects.toThrow();
    });
  });

  describe('getSummariesByIds', () => {
    const languageCode = 'en';
    const ids = [1];
    const summaries = {
      id: 1,
      image_url: 'image',
      source_type: 'type',
      source_url: 'url',
      reading_time: 10,
      created_at: '2021-08-01T00:00:00.000Z',
      authors: { name: 'author', description: 'description' },
      topics: { name: 'topic' },
    };
    const summariesResult = {
      id: 1,
      title: 'title',
      image_url: 'image',
      source_type: 'type',
      source_url: 'url',
      reading_time: 10,
      created_at: '2021-08-01T00:00:00.000Z',
      author_name: 'author',
      author_description: 'description',
      topic_name: 'topic',
    };

    const mockGetSummariesByIdsSuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('summary_translations')
          .select(
            'title, summaries(id, image_url, source_type, source_url, reading_time, created_at, authors(name, description), topics(name))',
          )
          .eq('summaries.production', true).in as jest.Mock
      ).mockResolvedValueOnce({ data: [{ title: 'title', summaries }] });

    const mockGetSummariesByIdsError = () =>
      (
        mockSupabaseService
          .getClient()
          .from('summary_translations')
          .select(
            'title, summaries(id, image_url, source_type, source_url, reading_time, created_at, authors(name, description), topics(name))',
          )
          .eq('summaries.production', true).in as jest.Mock
      ).mockResolvedValueOnce({ error: 'error' });

    const mockGetAuthorFromSummaryId = () =>
      (
        mockAuthorService.getAuthorFromSummaryId as jest.Mock
      ).mockResolvedValueOnce({ name: 'author', description: 'description' });

    const mockGetTopicFromSummaryId = () =>
      (
        mockTopicService.getTopicFromSummaryId as jest.Mock
      ).mockResolvedValueOnce({ name: 'topic' });

    const mockGetAuthorFromSummaryIdError = () =>
      (
        mockAuthorService.getAuthorFromSummaryId as jest.Mock
      ).mockRejectedValueOnce(new Error('error'));

    it('should return summaries', async () => {
      mockGetSummariesByIdsSuccess();
      mockGetAuthorFromSummaryId();
      mockGetTopicFromSummaryId();

      const result = await service.getSummariesByIds(ids, languageCode);
      expect(result).toEqual([summariesResult]);
    });

    it('should throw an error', async () => {
      mockGetSummariesByIdsError();

      await expect(
        service.getSummariesByIds(ids, languageCode),
      ).rejects.toThrow();
    });

    it("should throw an error if author's data is not available", async () => {
      mockGetSummariesByIdsSuccess();
      mockGetAuthorFromSummaryIdError();
      mockGetTopicFromSummaryId();

      await expect(
        service.getSummariesByIds(ids, languageCode),
      ).rejects.toThrow();
    });
  });

  describe('searchSummaries', () => {
    const languageCode = 'en';
    const query = 'query';

    const summaries = {
      id: 1,
      image_url: 'image',
      source_type: 'type',
      source_url: 'url',
      reading_time: 10,
      created_at: '2021-08-01T00:00:00.000Z',
      authors: { name: 'author', description: 'description' },
      topics: { name: 'topic' },
    };
    const summariesResult = {
      id: 1,
      title: 'title',
      image_url: 'image',
      source_type: 'type',
      source_url: 'url',
      reading_time: 10,
      created_at: '2021-08-01T00:00:00.000Z',
      author_name: 'author',
      author_description: 'description',
      topic_name: 'topic',
    };

    const mockSearchSummariesSuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('summary_translations')
          .select(
            'title, summaries(id, image_url, source_type, source_url, reading_time, created_at, authors(name, description), topics(name))',
          )
          .textSearch('title', query, {
            type: 'websearch',
          }).match as jest.Mock
      ).mockResolvedValueOnce({ data: [{ title: 'title', summaries }] });

    const mockSearchSummariesError = () =>
      (
        mockSupabaseService
          .getClient()
          .from('summary_translations')
          .select(
            'title, summaries(id, image_url, source_type, source_url, reading_time, created_at, authors(name, description), topics(name))',
          )
          .textSearch('title', query, {
            type: 'websearch',
          }).match as jest.Mock
      ).mockResolvedValueOnce({ error: 'error' });

    it('should return summaries', async () => {
      mockSearchSummariesSuccess();
      const result = await service.searchSummaries(query, languageCode);
      expect(result).toEqual([summariesResult]);
    });

    it('should throw an error', async () => {
      mockSearchSummariesError();
      await expect(
        service.searchSummaries(query, languageCode),
      ).rejects.toThrow('An error occurred while fetching summaries');
    });
  });

  describe('getSummariesByTopicId', () => {
    const languageCode = 'en';
    const topicId = 1;

    const summaries = {
      id: 1,
      image_url: 'image',
      source_type: 'type',
      source_url: 'url',
      reading_time: 10,
      created_at: '2021-08-01T00:00:00.000Z',
      authors: { name: 'author', description: 'description' },
      topics: { name: 'topic' },
    };
    const summariesResult = {
      id: 1,
      title: 'title',
      image_url: 'image',
      source_type: 'type',
      source_url: 'url',
      reading_time: 10,
      created_at: '2021-08-01T00:00:00.000Z',
      author_name: 'author',
      author_description: 'description',
      topic_name: 'topic',
    };

    const mockGetSummariesByTopicIdSuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('summary_translations')
          .select(
            'title, summaries(id, image_url, source_type, source_url, reading_time, created_at, authors(name, description), topics(name))',
          ).match as jest.Mock
      ).mockResolvedValueOnce({ data: [{ title: 'title', summaries }] });

    const mockGetSummariesByTopicIdError = () =>
      (
        mockSupabaseService
          .getClient()
          .from('summary_translations')
          .select(
            'title, summaries(id,, image_url, source_type, source_url, reading_time, created_at, authors(name, description), topics(name))',
          ).match as jest.Mock
      ).mockResolvedValueOnce({ error: 'error' });

    it('should return summaries', async () => {
      mockGetSummariesByTopicIdSuccess();
      const result = await service.getSummariesByTopicId(topicId, languageCode);
      expect(result).toEqual([summariesResult]);
    });

    it('should throw an error', async () => {
      mockGetSummariesByTopicIdError();
      await expect(
        service.getSummariesByTopicId(topicId, languageCode),
      ).rejects.toThrow('An error occurred while fetching summaries');
    });
  });

  describe('getBestRatedSummaries', () => {
    const languageCode = 'en';
    const summaries = {
      id: 1,
      title: 'title',
      image_url: 'image',
      source_type: 'type',
      source_url: 'url',
      reading_time: 10,
      created_at: '2021-08-01T00:00:00.000Z',
      authors: { name: 'author', description: 'description' },
      topics: { name: 'topic' },
    };
    const summariesResult = {
      id: 1,
      title: 'title',
      image_url: 'image',
      source_type: 'type',
      source_url: 'url',
      reading_time: 10,
      created_at: '2021-08-01T00:00:00.000Z',
      author_name: 'author',
      author_description: 'description',
      topic_name: 'topic',
    };

    const mockGetBestRatedSummariesSuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('summary_translations')
          .select(
            'title, summaries(id, image_url, source_type, source_url, reading_time, created_at, authors(name, description), topics(name))',
          )
          .eq('summaries.production', true).order as jest.Mock
      ).mockResolvedValueOnce({ data: [{ summary_id: 1, summaries }] });

    const mockGetBestRatedSummariesError = () =>
      (
        mockSupabaseService
          .getClient()
          .from('summary_translations')
          .select(
            'title, summaries(id, image_url, source_type, source_url, reading_time, created_at, authors(name, description), topics(name))',
          )
          .eq('summaries.production', true).order as jest.Mock
      ).mockResolvedValueOnce({ error: 'error' });

    const mockGetSummariesByIds = () =>
      (service.getSummariesByIds = jest
        .fn()
        .mockResolvedValueOnce([summariesResult]));

    it('should return summaries', async () => {
      mockGetBestRatedSummariesSuccess();
      mockGetSummariesByIds();

      const result = await service.getBestRatedSummaries(languageCode);
      expect(result).toEqual([summariesResult]);
    });

    it('should throw an error', async () => {
      mockGetBestRatedSummariesError();
      await expect(service.getBestRatedSummaries(languageCode)).rejects.toThrow(
        'An error occurred while fetching summaries',
      );
    });
  });

  describe('getReadSummaries', () => {
    const userId = 'user1';
    const summaries = {
      id: 1,
      title: 'title',
      image_url: 'image',
      source_type: 'type',
      source_url: 'url',
      reading_time: 10,
      created_at: '2021-08-01T00:00:00.000Z',
      authors: { name: 'author', description: 'description' },
      topics: { name: 'topic' },
    };
    const summariesResult = {
      id: 1,
      title: 'title',
      image_url: 'image',
      source_type: 'type',
      source_url: 'url',
      reading_time: 10,
      created_at: '2021-08-01T00:00:00.000Z',
      author_name: 'author',
      author_description: 'description',
      topic_name: 'topic',
    };

    const mockGetReadSummariesSuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('read_summaries')
          .select(
            'title, summaries(id, image_url, source_type, source_url, reading_time, created_at, authors(name, description), topics(name))',
          ).match as jest.Mock
      ).mockResolvedValueOnce({ data: [{ summaries }] });

    const mockGetReadSummariesError = () =>
      (
        mockSupabaseService
          .getClient()
          .from('read_summaries')
          .select(
            'title, summaries(id, image_url, source_type, source_url, reading_time, created_at, authors(name, description), topics(name))',
          ).match as jest.Mock
      ).mockResolvedValueOnce({ error: 'error' });

    it('should return summaries', async () => {
      mockGetReadSummariesSuccess();
      const result = await service.getReadSummaries(userId);
      expect(result).toEqual([summariesResult]);
    });

    it('should throw an error', async () => {
      mockGetReadSummariesError();
      await expect(service.getReadSummaries(userId)).rejects.toThrow(
        'An error occurred while fetching read summaries',
      );
    });
  });

  describe('getSavedSummaries', () => {
    const userId = 'user1';
    const summariesData = {
      summaries: {
        id: 1,
        title: 'title',
        image_url: 'image',
        source_type: 'type',
        source_url: 'url',
        reading_time: 10,
        created_at: '2021-08-01T00:00:00.000Z',
        authors: { name: 'author', description: 'description' },
        topics: { name: 'topic' },
      },
    };
    const summaries = {
      id: 1,
      title: 'title',
      image_url: 'image',
      source_type: 'type',
      source_url: 'url',
      reading_time: 10,
      created_at: '2021-08-01T00:00:00.000Z',
      author_name: 'author',
      author_description: 'description',
      topic_name: 'topic',
    };

    const mockGetSavedSummariesSuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('saved_summaries')
          .select(
            'title, summaries(id, image_url, source_type, source_url, reading_time, created_at, authors(name, description), topics(name))',
          ).match as jest.Mock
      ).mockResolvedValueOnce({ data: [summariesData] });

    const mockGetSavedSummariesError = () =>
      (
        mockSupabaseService
          .getClient()
          .from('saved_summaries')
          .select(
            'title, summaries(id, image_url, source_type, source_url, reading_time, created_at, authors(name, description), topics(name))',
          ).match as jest.Mock
      ).mockResolvedValueOnce({ error: 'error' });

    it('should return summaries', async () => {
      mockGetSavedSummariesSuccess();
      const result = await service.getSavedSummaries(userId);
      expect(result).toEqual([summaries]);
    });

    it('should throw an error', async () => {
      mockGetSavedSummariesError();
      await expect(service.getSavedSummaries(userId)).rejects.toThrow(
        'An error occurred while fetching saved summaries',
      );
    });
  });

  describe('getReadSummariesTimestamps', () => {
    const userId = 'user1';
    const timestampsData = [
      { read_at: '2021-08-01T00:00:00.000Z' },
      { read_at: '2021-08-02T00:00:00.000Z' },
    ];
    const timestamps = ['2021-08-01T00:00:00.000Z', '2021-08-02T00:00:00.000Z'];

    const mockGetReadSummariesTimestampsSuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('read_summaries')
          .select('read_at, summaries(production)').match as jest.Mock
      ).mockResolvedValueOnce({ data: timestampsData });

    const mockGetReadSummariesTimestampsError = () =>
      (
        mockSupabaseService
          .getClient()
          .from('read_summaries')
          .select('read_at, summaries(production)').match as jest.Mock
      ).mockResolvedValueOnce({ error: 'error' });

    it('should return timestamps', async () => {
      mockGetReadSummariesTimestampsSuccess();
      const result = await service.getReadSummariesTimestamps(userId);
      expect(result).toEqual({ timestamps });
    });

    it('should throw an error', async () => {
      mockGetReadSummariesTimestampsError();
      await expect(service.getReadSummariesTimestamps(userId)).rejects.toThrow(
        'An error occurred while fetching read summaries',
      );
    });
  });

  describe('getReadSummariesCount', () => {
    const userId = 'user1';
    const count = 2;

    const mockGetReadSummariesCountSuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('read_summaries')
          .select('user_id, summaries(production)', {
            count: 'exact',
            head: true,
          }).match as jest.Mock
      ).mockResolvedValueOnce({ count });

    const mockGetReadSummariesCountError = () =>
      (
        mockSupabaseService
          .getClient()
          .from('read_summaries')
          .select('user_id, summaries(production)', {
            count: 'exact',
            head: true,
          }).match as jest.Mock
      ).mockResolvedValueOnce({ error: 'error' });

    it('should return count', async () => {
      mockGetReadSummariesCountSuccess();
      const result = await service.getReadSummariesCount(userId);
      expect(result).toEqual({ count });
    });

    it('should throw an error', async () => {
      mockGetReadSummariesCountError();
      await expect(service.getReadSummariesCount(userId)).rejects.toThrow(
        'An error occurred while fetching read summaries count',
      );
    });
  });
});
