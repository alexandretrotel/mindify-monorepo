import { Test, TestingModule } from '@nestjs/testing';
import { TopicService } from './topic.service';
import { SupabaseService } from '../common/supabase';
import { ConfigService } from '@nestjs/config';
import { mockSupabaseService } from 'src/common/__mocks__/supabase';

jest.spyOn(console, 'error').mockImplementation(() => null);

describe('TopicService', () => {
  let service: TopicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TopicService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
        ConfigService,
      ],
    }).compile();

    service = module.get<TopicService>(TopicService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTopicName', () => {
    const topicId = 1;
    const languageCode = 'en';

    const mockGetTopicNameSuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('topic_translations')
          .select('topic_id, name')
          .match({ topic_id: topicId, language_code: languageCode })
          .single as jest.Mock
      ).mockResolvedValueOnce({
        error: null,
        data: { name: 'Test' },
      });

    const mockGetTopicNameError = () =>
      (
        mockSupabaseService
          .getClient()
          .from('topic_translations')
          .select('topic_id, name')
          .match({ topic_id: topicId, language_code: languageCode })
          .single as jest.Mock
      ).mockResolvedValueOnce({
        error: new Error(),
        data: null,
      });

    it('should return the topic name', async () => {
      mockGetTopicNameSuccess();

      const result = await service.getTopicName(topicId, languageCode);

      expect(result).toEqual({ name: 'Test' });
    });

    it('should throw an InternalServerErrorException if an error occurs', async () => {
      mockGetTopicNameError();

      await expect(service.getTopicName(topicId, languageCode)).rejects.toThrow(
        "An error occurred while fetching the topic's name.",
      );
    });
  });

  describe('getTopicFromSummaryId', () => {
    const summaryId = 1;
    const topicId = 1;
    const languageCode = 'en';

    const mockGetTopicFromSummaryIdSuccess = () => {
      const mockSupabaseClient = mockSupabaseService.getClient();

      (
        mockSupabaseClient
          .from('summaries')
          .select('topics(id)')
          .eq('id', summaryId).single as jest.Mock
      ).mockResolvedValueOnce({
        error: null,
        data: { topics: { id: topicId } },
      });
    };

    const mockGetTopicFromSummaryIdTopicSuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('topic_translations')
          .select('name')
          .match({ topic_id: topicId, language_code: languageCode })
          .single as jest.Mock
      ).mockResolvedValueOnce({
        error: null,
        data: { name: 'Test' },
      });

    const mockGetTopicFromSummaryIdError = () => {
      const mockSupabaseClient = mockSupabaseService.getClient();

      (
        mockSupabaseClient
          .from('summaries')
          .select('topics(id)')
          .eq('id', summaryId).single as jest.Mock
      ).mockResolvedValueOnce({
        error: new Error(),
        data: null,
      });
    };

    const mockGetTopicFromSummaryIdTopicError = () =>
      (
        mockSupabaseService
          .getClient()
          .from('topic_translations')
          .select('name')
          .match({ topic_id: topicId, language_code: languageCode })
          .single as jest.Mock
      ).mockResolvedValueOnce({
        error: new Error("An error occurred while fetching the topic's name."),
        data: null,
      });

    it('should return the topic name', async () => {
      mockGetTopicFromSummaryIdSuccess();
      mockGetTopicFromSummaryIdTopicSuccess();

      const result = await service.getTopicFromSummaryId(
        summaryId,
        languageCode,
      );

      expect(result).toEqual({ name: 'Test' });
    });

    it('should throw an InternalServerErrorException if an error occurs while fetching the topic', async () => {
      mockGetTopicFromSummaryIdSuccess();
      mockGetTopicFromSummaryIdTopicError();

      await expect(
        service.getTopicFromSummaryId(summaryId, languageCode),
      ).rejects.toThrow('An error occurred while fetching the topic.');
    });

    it('should throw an InternalServerErrorException if an error occurs while fetching the summary', async () => {
      mockGetTopicFromSummaryIdError();

      await expect(
        service.getTopicFromSummaryId(summaryId, languageCode),
      ).rejects.toThrow(
        'An error occurred while fetching the topic of the summary.',
      );
    });
  });
});
