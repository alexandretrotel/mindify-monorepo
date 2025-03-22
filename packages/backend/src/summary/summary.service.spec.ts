import { Test, TestingModule } from '@nestjs/testing';
import { SummaryService } from './summary.service';
import { SupabaseService } from '../common/supabase';
import { NotificationService } from 'src/notification/notification.service';
import { ExpoService } from '../common/expo/expo.service';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { mockSupabaseService } from 'src/common/__mocks__/supabase';
import { mockUserService } from 'src/common/__mocks__/user.service';
import { mockNotificationService } from 'src/common/__mocks__/notification.service';
import { AuthorService } from 'src/author/author.service';
import { mockAuthorService } from 'src/common/__mocks__/author.service';
import { TopicService } from 'src/topic/topic.service';
import { mockTopicService } from 'src/common/__mocks__/topic.service';
import { ChaptersService } from 'src/chapters/chapters.service';
import { mockChaptersService } from 'src/common/__mocks__/chapters.service';

jest.spyOn(console, 'error').mockImplementation(() => null);

describe('SummaryService', () => {
  let service: SummaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SummaryService,
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
        ExpoService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: AuthorService,
          useValue: mockAuthorService,
        },
        {
          provide: TopicService,
          useValue: mockTopicService,
        },
        {
          provide: ChaptersService,
          useValue: mockChaptersService,
        },
        ConfigService,
      ],
    }).compile();

    service = module.get<SummaryService>(SummaryService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSummarySavedCount', () => {
    const summaryId = 1;

    const mockGetSummarySavedCountSuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('saved_summaries')
          .select('*, summaries(production)', { count: 'exact' })
          .match as jest.Mock
      ).mockResolvedValueOnce({
        count: 1,
      });

    const mockGetSummarySavedCountError = () =>
      (
        mockSupabaseService
          .getClient()
          .from('saved_summaries')
          .select('*, summaries(production)', { count: 'exact' })
          .match as jest.Mock
      ).mockResolvedValueOnce({
        error: 'An error occurred while fetching the number of saves',
      });

    it('should return the number of saves', async () => {
      mockGetSummarySavedCountSuccess();

      const count = await service.getSummarySavedCount(summaryId);

      expect(count).toEqual({ count: 1 });
    });

    it('should throw an error if the number of saves cannot be fetched', async () => {
      mockGetSummarySavedCountError();

      await expect(service.getSummarySavedCount(summaryId)).rejects.toThrow(
        'An error occurred while fetching the number of saves',
      );
    });
  });

  describe('getSummaryReadCount', () => {
    const summaryId = 1;

    const mockGetSummaryReadCountSuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('read_summaries')
          .select('*, summaries(production)', { count: 'exact' })
          .match as jest.Mock
      ).mockResolvedValueOnce({
        count: 1,
      });

    const mockGetSummaryReadCountError = () =>
      (
        mockSupabaseService
          .getClient()
          .from('read_summaries')
          .select('*, summaries(production)', { count: 'exact' })
          .match as jest.Mock
      ).mockResolvedValueOnce({
        error: 'An error occurred while fetching the number of reads',
      });

    it('should return the number of reads', async () => {
      mockGetSummaryReadCountSuccess();

      const count = await service.getSummaryReadCount(summaryId);

      expect(count).toEqual({ count: 1 });
    });

    it('should throw an error if the number of reads cannot be fetched', async () => {
      mockGetSummaryReadCountError();

      await expect(service.getSummaryReadCount(summaryId)).rejects.toThrow(
        'An error occurred while fetching the number of reads',
      );
    });
  });

  describe('getSummaryRating', () => {
    const summaryId = 1;

    const mockGetSummaryRatingSuccess = () =>
      (
        mockSupabaseService.getClient().from('summary_ratings').select('rating')
          .eq as jest.Mock
      ).mockResolvedValueOnce({
        data: [{ rating: 5 }, { rating: 3 }],
      });

    const mockGetSummaryRatingError = () =>
      (
        mockSupabaseService.getClient().from('summary_ratings').select('rating')
          .eq as jest.Mock
      ).mockResolvedValueOnce({
        error: 'An error occurred while fetching the summary rating',
      });

    it('should return the average rating', async () => {
      mockGetSummaryRatingSuccess();

      const rating = await service.getSummaryRating(summaryId);

      expect(rating).toEqual({ rating: 4 });
    });

    it('should return 0 if the average rating is NaN', async () => {
      (
        mockSupabaseService.getClient().from('summary_ratings').select('rating')
          .eq as jest.Mock
      ).mockResolvedValueOnce({
        data: [],
      });

      const rating = await service.getSummaryRating(summaryId);

      expect(rating).toEqual({ rating: 0 });
    });

    it('should throw an error if the rating cannot be fetched', async () => {
      mockGetSummaryRatingError();

      await expect(service.getSummaryRating(summaryId)).rejects.toThrow(
        'An error occurred while fetching the summary rating',
      );
    });
  });

  describe('getSummary', () => {
    const summaryId = 1;
    const languageCode = 'en';

    const mockGetSummarySuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('summary_translations')
          .select(
            'title, summaries(*, authors(name, slug, description), topics(name, slug), chapters(*))',
          )
          .match({
            id: summaryId,
            'summaries.production': true,
            language_code: languageCode,
          }).single as jest.Mock
      ).mockResolvedValueOnce({
        data: {
          id: 1,
          title: 'Summary 1',
          summaries: {
            id: 1,
            image_url: '',
            source_type: 'external',
            source_url: '',
            reading_time: 0,
            created_at: '',
          },
        },
        error: null,
      });

    const mockGetSummaryError = () =>
      (
        mockSupabaseService
          .getClient()
          .from('summary_translations')
          .select(
            '*, summaries(*, authors(name, slug, description), topics(name, slug), chapters(*))',
          )
          .match({
            id: summaryId,
            'summaries.production': true,
            language_code: languageCode,
          }).single as jest.Mock
      ).mockResolvedValueOnce({
        error: 'An error occurred while fetching the summary',
      });

    const mockGetAuthorFromSummaryIdSuccess = () =>
      (
        mockAuthorService.getAuthorFromSummaryId as jest.Mock
      ).mockResolvedValueOnce({
        name: 'John Doe',
        slug: 'john-doe',
        description: 'Description',
      });

    const mockGetAuthorFromSummaryIdError = () =>
      (
        mockAuthorService.getAuthorFromSummaryId as jest.Mock
      ).mockRejectedValueOnce(
        new Error(
          'An error occurred while fetching the author from the summary ID',
        ),
      );

    const mockGetTopicFromSummaryIdSuccess = () =>
      (
        mockTopicService.getTopicFromSummaryId as jest.Mock
      ).mockResolvedValueOnce({
        name: 'Topic 1',
        slug: 'topic-1',
      });

    const mockGetTopicFromSummaryIdError = () =>
      (
        mockTopicService.getTopicFromSummaryId as jest.Mock
      ).mockRejectedValueOnce(
        new Error(
          'An error occurred while fetching the topic from the summary ID',
        ),
      );

    const mockGetChaptersFromIdSuccess = () =>
      (
        mockChaptersService.getChaptersFromId as jest.Mock
      ).mockResolvedValueOnce({
        id: 1,
        titles: ['Chapter 1'],
        texts: ['Text 1'],
      });

    const mockGetChaptersFromIdError = () =>
      (
        mockChaptersService.getChaptersFromId as jest.Mock
      ).mockRejectedValueOnce(
        new Error('An error occurred while fetching the chapters from the ID'),
      );

    it('should return the summary', async () => {
      mockGetSummarySuccess();
      mockGetAuthorFromSummaryIdSuccess();
      mockGetTopicFromSummaryIdSuccess();
      mockGetChaptersFromIdSuccess();

      const summary = await service.getSummary(summaryId, languageCode);

      expect(summary).toEqual({
        id: 1,
        title: 'Summary 1',
        image_url: '',
        source_type: 'external',
        source_url: '',
        reading_time: 0,
        created_at: '',
        author_name: 'John Doe',
        author_description: 'Description',
        topic_name: 'Topic 1',
        chapters: { id: 1, titles: ['Chapter 1'], texts: ['Text 1'] },
      });
    });

    it('should throw an error if the summary cannot be fetched', async () => {
      mockGetSummaryError();

      await expect(service.getSummary(summaryId, languageCode)).rejects.toThrow(
        'An error occurred while fetching the summary',
      );
    });

    it('should throw an error if the author cannot be fetched', async () => {
      mockGetSummarySuccess();
      mockGetAuthorFromSummaryIdError();

      await expect(service.getSummary(summaryId, languageCode)).rejects.toThrow(
        'An error occurred while fetching the author from the summary ID',
      );
    });

    it('should throw an error if the topic cannot be fetched', async () => {
      mockGetSummarySuccess();
      mockGetAuthorFromSummaryIdSuccess();
      mockGetTopicFromSummaryIdError();

      await expect(service.getSummary(summaryId, languageCode)).rejects.toThrow(
        'An error occurred while fetching the topic from the summary ID',
      );
    });

    it('should throw an error if the chapters cannot be fetched', async () => {
      mockGetSummarySuccess();
      mockGetAuthorFromSummaryIdSuccess();
      mockGetTopicFromSummaryIdSuccess();
      mockGetChaptersFromIdError();

      await expect(service.getSummary(summaryId, languageCode)).rejects.toThrow(
        'An error occurred while fetching the chapters from the ID',
      );
    });
  });

  describe('rateSummary', () => {
    const userId = '1';
    const summaryId = 1;
    const rating = 5;

    const mockRateSummarySuccess = () =>
      (
        mockSupabaseService.getClient().from('summary_ratings')
          .upsert as jest.Mock
      ).mockResolvedValueOnce({
        error: null,
      });

    const mockRateSummaryError = () =>
      (
        mockSupabaseService.getClient().from('summary_ratings')
          .upsert as jest.Mock
      ).mockResolvedValueOnce({
        error: 'An error occurred while rating the summary',
      });

    it('should return the rating', async () => {
      mockRateSummarySuccess();

      const result = await service.rateSummary(userId, summaryId, rating);

      expect(result).toEqual({
        success: true,
        message: 'Summary rated successfully',
      });
    });

    it('should throw an error if the rating cannot be saved', async () => {
      mockRateSummaryError();

      await expect(
        service.rateSummary(userId, summaryId, rating),
      ).rejects.toThrow('An error occurred while rating');
    });
  });

  describe('saveSummary', () => {
    const userId = '1';
    const summaryId = 1;
    const languageCode = 'en';

    const mockSaveSummarySuccess = () =>
      (
        mockSupabaseService.getClient().from('saved_summaries')
          .insert as jest.Mock
      ).mockResolvedValueOnce({
        error: null,
      });

    const mockSaveSummaryError = () =>
      (
        mockSupabaseService.getClient().from('saved_summaries')
          .insert as jest.Mock
      ).mockResolvedValueOnce({
        error: 'An error occurred while saving the summary',
      });

    const mockNotifyFriendSavedSummarySuccess = () =>
      (
        mockNotificationService.notifyFriendSavedSummary as jest.Mock
      ).mockResolvedValueOnce({ success: true, message: 'Notification sent' });

    const mockNotifyFriendSavedSummaryError = () =>
      (
        mockNotificationService.notifyFriendSavedSummary as jest.Mock
      ).mockRejectedValueOnce(
        new Error(
          'An error occurred while notifying the friend that the summary was saved',
        ),
      );

    it('should return success', async () => {
      mockSaveSummarySuccess();
      mockNotifyFriendSavedSummarySuccess();

      const result = await service.saveSummary(userId, summaryId, languageCode);

      expect(result).toEqual({
        success: true,
        message: 'Summary saved successfully',
      });
    });

    it('should throw an error if the summary cannot be saved', async () => {
      mockSaveSummaryError();

      await expect(
        service.saveSummary(userId, summaryId, languageCode),
      ).rejects.toThrow('An error occurred while saving the summary');
    });

    it('should throw an error if the friend cannot be notified', async () => {
      mockSaveSummarySuccess();
      mockNotifyFriendSavedSummaryError();

      await expect(
        service.saveSummary(userId, summaryId, languageCode),
      ).rejects.toThrow(
        'An error occurred while notifying the friend that the summary was saved',
      );
    });
  });

  describe('unsaveSummary', () => {
    const userId = '1';
    const summaryId = 1;

    const mockUnsaveSummarySuccess = () =>
      (
        mockSupabaseService.getClient().from('saved_summaries').delete()
          .match as jest.Mock
      ).mockResolvedValueOnce({
        error: null,
      });

    const mockUnsaveSummaryError = () =>
      (
        mockSupabaseService.getClient().from('saved_summaries').delete()
          .match as jest.Mock
      ).mockResolvedValueOnce({
        error: 'An error occurred while unsaving the summary',
      });

    it('should return success', async () => {
      mockUnsaveSummarySuccess();

      const result = await service.unsaveSummary(userId, summaryId);

      expect(result).toEqual({
        success: true,
        message: 'Summary unsaved successfully',
      });
    });

    it('should throw an error if the summary cannot be unsaved', async () => {
      mockUnsaveSummaryError();

      await expect(service.unsaveSummary(userId, summaryId)).rejects.toThrow(
        'An error occurred while unsaving the summary',
      );
    });
  });

  describe('markSummaryAsRead', () => {
    const languageCode = 'en';
    const userId = '1';
    const summaryId = 1;

    const mockMarkSummaryAsReadSuccess = () =>
      (
        mockSupabaseService.getClient().from('read_summaries')
          .insert as jest.Mock
      ).mockResolvedValueOnce({
        error: null,
      });

    const mockMarkSummaryAsReadError = () =>
      (
        mockSupabaseService.getClient().from('read_summaries')
          .insert as jest.Mock
      ).mockResolvedValueOnce({
        error: 'An error occurred while marking the summary as read',
      });

    const mockNotifyFriendReadSummarySuccess = () =>
      (
        mockNotificationService.notifyFriendReadSummary as jest.Mock
      ).mockResolvedValueOnce({ success: true, message: 'Notification sent' });

    const mockNotifyFriendReadSummaryError = () =>
      (
        mockNotificationService.notifyFriendReadSummary as jest.Mock
      ).mockRejectedValueOnce(
        new Error(
          'An error occurred while notifying the friend that the summary was read',
        ),
      );

    it('should return success', async () => {
      mockMarkSummaryAsReadSuccess();
      mockNotifyFriendReadSummarySuccess();

      const result = await service.markSummaryAsRead(
        userId,
        summaryId,
        languageCode,
      );

      expect(result).toEqual({
        success: true,
        message: 'Summary marked as read successfully',
      });
    });

    it('should throw an error if the summary cannot be marked as read', async () => {
      mockMarkSummaryAsReadError();

      await expect(
        service.markSummaryAsRead(userId, summaryId, languageCode),
      ).rejects.toThrow('An error occurred while marking the summary as read');
    });

    it('should throw an error if the friend cannot be notified', async () => {
      mockMarkSummaryAsReadSuccess();
      mockNotifyFriendReadSummaryError();

      await expect(
        service.markSummaryAsRead(userId, summaryId, languageCode),
      ).rejects.toThrow(
        'An error occurred while notifying the friend that the summary was read',
      );
    });
  });

  describe('markSummaryAsUnread', () => {
    const userId = '1';
    const summaryId = 1;

    const mockMarkSummaryAsUnreadSuccess = () =>
      (
        mockSupabaseService.getClient().from('read_summaries').delete()
          .match as jest.Mock
      ).mockResolvedValueOnce({
        error: null,
      });

    const mockMarkSummaryAsUnreadError = () =>
      (
        mockSupabaseService.getClient().from('read_summaries').delete()
          .match as jest.Mock
      ).mockResolvedValueOnce({
        error: 'An error occurred while marking the summary as unread',
      });

    it('should return success', async () => {
      mockMarkSummaryAsUnreadSuccess();

      const result = await service.markSummaryAsUnread(userId, summaryId);

      expect(result).toEqual({
        success: true,
        message: 'Summary marked as unread successfully',
      });
    });

    it('should throw an error if the summary cannot be marked as unread', async () => {
      mockMarkSummaryAsUnreadError();

      await expect(
        service.markSummaryAsUnread(userId, summaryId),
      ).rejects.toThrow(
        'An error occurred while marking the summary as unread',
      );
    });
  });

  describe('isSummarySaved', () => {
    const userId = '1';
    const summaryId = 1;

    const mockIsSummarySavedSuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('saved_summaries')
          .select('*')
          .match({
            user_id: userId,
            summary_id: summaryId,
          }).maybeSingle as jest.Mock
      ).mockResolvedValueOnce({
        data: { user_id: userId, summary_id: summaryId },
      });

    const mockIsSummarySavedError = () =>
      (
        mockSupabaseService
          .getClient()
          .from('saved_summaries')
          .select('*')
          .match({
            user_id: userId,
            summary_id: summaryId,
          }).maybeSingle as jest.Mock
      ).mockResolvedValueOnce({
        error: 'An error occurred while checking if the summary is saved',
      });

    it('should return true if the summary is saved', async () => {
      mockIsSummarySavedSuccess();

      const isSaved = await service.isSummarySaved(userId, summaryId);

      expect(isSaved).toEqual({ value: true });
    });

    it('should return false if the summary is not saved', async () => {
      (
        mockSupabaseService
          .getClient()
          .from('saved_summaries')
          .select('*')
          .match({
            user_id: userId,
            summary_id: summaryId,
          }).maybeSingle as jest.Mock
      ).mockResolvedValueOnce({
        data: null,
      });

      const isSaved = await service.isSummarySaved(userId, summaryId);

      expect(isSaved).toEqual({ value: false });
    });

    it('should throw an error if the summary cannot be checked', async () => {
      mockIsSummarySavedError();

      await expect(service.isSummarySaved(userId, summaryId)).rejects.toThrow(
        'An error occurred while checking if the summary is saved',
      );
    });
  });

  describe('isSummaryRead', () => {
    const userId = '1';
    const summaryId = 1;

    const mockIsSummaryReadSuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('read_summaries')
          .select('*')
          .match({
            user_id: userId,
            summary_id: summaryId,
          }).maybeSingle as jest.Mock
      ).mockResolvedValueOnce({
        data: { user_id: userId, summary_id: summaryId },
      });

    const mockIsSummaryReadError = () =>
      (
        mockSupabaseService
          .getClient()
          .from('read_summaries')
          .select('*')
          .match({
            user_id: userId,
            summary_id: summaryId,
          }).maybeSingle as jest.Mock
      ).mockResolvedValueOnce({
        error: 'An error occurred while checking if the summary is read',
      });

    it('should return true if the summary is read', async () => {
      mockIsSummaryReadSuccess();

      const isRead = await service.isSummaryRead(userId, summaryId);

      expect(isRead).toEqual({ value: true });
    });

    it('should return false if the summary is not read', async () => {
      (
        mockSupabaseService
          .getClient()
          .from('read_summaries')
          .select('*')
          .match({
            user_id: userId,
            summary_id: summaryId,
          }).maybeSingle as jest.Mock
      ).mockResolvedValueOnce({
        data: null,
      });

      const isRead = await service.isSummaryRead(userId, summaryId);

      expect(isRead).toEqual({ value: false });
    });

    it('should throw an error if the summary cannot be checked', async () => {
      mockIsSummaryReadError();

      await expect(service.isSummaryRead(userId, summaryId)).rejects.toThrow(
        'An error occurred while checking if the summary is read',
      );
    });
  });

  describe('getSummaryRating', () => {
    const summaryId = 1;

    const mockGetSummaryRatingSuccess = () =>
      (
        mockSupabaseService.getClient().from('summary_ratings').select('rating')
          .eq as jest.Mock
      ).mockResolvedValueOnce({
        data: [{ rating: 5 }, { rating: 3 }],
      });

    const mockGetSummaryRatingError = () =>
      (
        mockSupabaseService.getClient().from('summary_ratings').select('rating')
          .eq as jest.Mock
      ).mockResolvedValueOnce({
        error: 'An error occurred while fetching the summary rating',
      });

    it('should return the average rating', async () => {
      mockGetSummaryRatingSuccess();

      const result = await service.getSummaryRating(summaryId);

      expect(result).toEqual({ rating: 4 });
    });

    it('should return 0 if the average rating is NaN', async () => {
      (
        mockSupabaseService.getClient().from('summary_ratings').select('rating')
          .eq as jest.Mock
      ).mockResolvedValueOnce({
        data: [],
      });

      const result = await service.getSummaryRating(summaryId);

      expect(result).toEqual({ rating: 0 });
    });

    it('should throw an error if the rating cannot be fetched', async () => {
      mockGetSummaryRatingError();

      await expect(service.getSummaryRating(summaryId)).rejects.toThrow(
        'An error occurred while fetching the summary rating',
      );
    });
  });

  describe('getSummaryTitle', () => {
    const summaryId = 1;
    const languageCode = 'en';

    const mockGetSummaryTitleSuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('summary_translations')
          .select('title')
          .match({
            summary_id: summaryId,
            language_code: languageCode,
          }).single as jest.Mock
      ).mockResolvedValueOnce({
        data: { title: 'Summary 1' },
      });

    const mockGetSummaryTitleError = () =>
      (
        mockSupabaseService
          .getClient()
          .from('summary_translations')
          .select('title')
          .match({
            summary_id: summaryId,
            language_code: languageCode,
          }).single as jest.Mock
      ).mockResolvedValueOnce({
        error: 'An error occurred while fetching the summary title',
      });

    it('should return the summary title', async () => {
      mockGetSummaryTitleSuccess();

      const result = await service.getSummaryTitle(summaryId, languageCode);

      expect(result).toEqual({ title: 'Summary 1' });
    });

    it('should throw an error if the title cannot be fetched', async () => {
      mockGetSummaryTitleError();

      await expect(
        service.getSummaryTitle(summaryId, languageCode),
      ).rejects.toThrow('An error occurred while fetching the summary title');
    });
  });
});
