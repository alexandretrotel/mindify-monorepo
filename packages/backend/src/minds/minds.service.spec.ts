import { Test, TestingModule } from '@nestjs/testing';
import { MindsService } from './minds.service';
import { SupabaseService } from '../common/supabase';
import { ConfigService } from '@nestjs/config';
import { mockSupabaseService } from 'src/common/__mocks__/supabase';

jest.spyOn(console, 'error').mockImplementation(() => null);

describe('MindsService', () => {
  let service: MindsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MindsService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
        ConfigService,
      ],
    }).compile();

    service = module.get<MindsService>(MindsService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('areMindsSaved', () => {
    const mockUserId = 'user1';
    const mockMindIds = [1, 2, 3];

    const mockGetMindsSuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('saved_minds')
          .select('mind_id')
          .eq('user_id', mockUserId).in as jest.Mock
      ).mockReturnValueOnce({
        data: [{ mind_id: 1 }, { mind_id: 2 }],
      });

    const mockGetMindsNotFound = () =>
      (
        mockSupabaseService
          .getClient()
          .from('saved_minds')
          .select('mind_id')
          .eq('user_id', mockUserId).in as jest.Mock
      ).mockReturnValueOnce({
        data: [],
      });

    const mockGetMindsError = () =>
      (
        mockSupabaseService
          .getClient()
          .from('saved_minds')
          .select('mind_id')
          .eq('user_id', mockUserId).in as jest.Mock
      ).mockReturnValueOnce({
        error: 'error',
      });

    it('should return an array of booleans indicating whether the minds are saved by the user', async () => {
      mockGetMindsSuccess();

      const result = await service.areMindsSaved(mockMindIds, mockUserId);

      expect(result).toEqual({ values: [true, true, false] });
    });

    it("should return an array of 'false' if the minds are not saved by the user", async () => {
      mockGetMindsNotFound();

      const result = await service.areMindsSaved(mockMindIds, mockUserId);

      expect(result).toEqual({ values: [false, false, false] });
    });

    it('should throw an InternalServerErrorException if an error occurs while checking if minds are saved', async () => {
      mockGetMindsError();

      await expect(
        service.areMindsSaved(mockMindIds, mockUserId),
      ).rejects.toThrow('An error occurred while checking if minds are saved.');
    });
  });

  describe('areMindsLiked', () => {
    const mockUserId = 'user1';
    const mockMindIds = [1, 2, 3];

    const mockGetMindsSuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('liked_minds')
          .select('mind_id')
          .eq('user_id', mockUserId).in as jest.Mock
      ).mockReturnValueOnce({
        data: [{ mind_id: 1 }, { mind_id: 2 }],
      });

    const mockGetMindsNotFound = () =>
      (
        mockSupabaseService
          .getClient()
          .from('liked_minds')
          .select('mind_id')
          .eq('user_id', mockUserId).in as jest.Mock
      ).mockReturnValueOnce({
        data: [],
      });

    const mockGetMindsError = () =>
      (
        mockSupabaseService
          .getClient()
          .from('liked_minds')
          .select('mind_id')
          .eq('user_id', mockUserId).in as jest.Mock
      ).mockReturnValueOnce({
        error: 'error',
      });

    it('should return an array of booleans indicating whether the minds are liked by the user', async () => {
      mockGetMindsSuccess();

      const result = await service.areMindsLiked(mockMindIds, mockUserId);

      expect(result).toEqual({ values: [true, true, false] });
    });

    it("should return an array of 'false' if the minds are not liked by the user", async () => {
      mockGetMindsNotFound();

      const result = await service.areMindsLiked(mockMindIds, mockUserId);

      expect(result).toEqual({ values: [false, false, false] });
    });

    it('should throw an InternalServerErrorException if an error occurs while checking if minds are liked', async () => {
      mockGetMindsError();

      await expect(
        service.areMindsLiked(mockMindIds, mockUserId),
      ).rejects.toThrow('An error occurred while checking if minds are liked.');
    });
  });

  describe('getSavedMindsCount', () => {
    const mockUserId = 'user1';

    const mockGetCountSuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('saved_minds')
          .select('user_id, minds(production)', {
            count: 'exact',
            head: true,
          }).match as jest.Mock
      ).mockReturnValueOnce({
        count: 3,
      });

    const mockGetCountNotFound = () =>
      (
        mockSupabaseService
          .getClient()
          .from('saved_minds')
          .select('user_id, minds(production)', {
            count: 'exact',
            head: true,
          }).match as jest.Mock
      ).mockReturnValueOnce({
        count: 0,
      });

    const mockGetCountError = () =>
      (
        mockSupabaseService
          .getClient()
          .from('saved_minds')
          .select('user_id, minds(production)', {
            count: 'exact',
            head: true,
          }).match as jest.Mock
      ).mockReturnValueOnce({
        error: 'error',
      });

    it('should return the count of minds saved by the user', async () => {
      mockGetCountSuccess();

      const result = await service.getSavedMindsCount(mockUserId);

      expect(result).toEqual({ count: 3 });
    });

    it("should return 0 if the user hasn't saved any minds", async () => {
      mockGetCountNotFound();

      const result = await service.getSavedMindsCount(mockUserId);

      expect(result).toEqual({ count: 0 });
    });

    it('should throw an InternalServerErrorException if an error occurs while getting the count of saved minds', async () => {
      mockGetCountError();

      await expect(service.getSavedMindsCount(mockUserId)).rejects.toThrow(
        'An error occurred while fetching the saved minds count.',
      );
    });
  });

  describe('getSavedMinds', () => {
    const mockUserId = 'user1';
    const mockData = [
      {
        user_id: 'user1',
        minds: {
          id: 1,
          production: true,
          text: 'text1',
          question: 'question1',
          summaries: {
            title: 'title1',
            authors: {
              name: 'author1',
            },
          },
        },
      },
      {
        user_id: 'user1',
        minds: {
          id: 2,
          text: 'text2',
          question: 'question2',
          production: true,
          summaries: {
            title: 'title2',
            authors: {
              name: 'author2',
            },
          },
        },
      },
    ];

    const mockGetDataSuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('saved_minds')
          .select('*, minds(*, summaries(title, authors(name)))')
          .match as jest.Mock
      ).mockReturnValueOnce({
        data: mockData,
      });

    const mockGetDataNotFound = () =>
      (
        mockSupabaseService
          .getClient()
          .from('saved_minds')
          .select('*, minds(*, summaries(title, authors(name)))')
          .match as jest.Mock
      ).mockReturnValueOnce({
        data: [],
      });

    const mockGetDataError = () =>
      (
        mockSupabaseService
          .getClient()
          .from('saved_minds')
          .select('*, minds(*, summaries(title, authors(name)))')
          .match as jest.Mock
      ).mockReturnValueOnce({
        error: 'error',
      });

    it('should return the minds saved by the user', async () => {
      mockGetDataSuccess();

      const result = await service.getSavedMinds(mockUserId);

      expect(result).toEqual([
        {
          id: mockData[0].minds.id,
          text: mockData[0].minds.text,
          question: mockData[0].minds.question,
          summary_title: mockData[0].minds.summaries.title,
          author_name: mockData[0].minds.summaries.authors.name,
        },
        {
          id: mockData[1].minds.id,
          text: mockData[1].minds.text,
          question: mockData[1].minds.question,
          summary_title: mockData[1].minds.summaries.title,
          author_name: mockData[1].minds.summaries.authors.name,
        },
      ]);
    });

    it('should return an empty array if the user has not saved any minds', async () => {
      mockGetDataNotFound();

      const result = await service.getSavedMinds(mockUserId);

      expect(result).toEqual([]);
    });

    it('should throw an InternalServerErrorException if an error occurs while getting the saved minds', async () => {
      mockGetDataError();

      await expect(service.getSavedMinds(mockUserId)).rejects.toThrow(
        'An error occurred while fetching the saved minds.',
      );
    });
  });
});
