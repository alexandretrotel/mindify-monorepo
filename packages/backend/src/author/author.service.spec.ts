import { Test, TestingModule } from '@nestjs/testing';
import { AuthorService } from './author.service';
import { SupabaseService } from '../common/supabase';
import { ConfigService } from '@nestjs/config';
import { mockSupabaseService } from 'src/common/__mocks__/supabase';

jest.spyOn(console, 'error').mockImplementation();

describe('AuthorService', () => {
  let service: AuthorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
        ConfigService,
      ],
    }).compile();

    service = module.get<AuthorService>(AuthorService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAuthorById', () => {
    const authorId = 1;
    const languageCode = 'en';
    const mockAuthorData = { name: 'Author Name', description: 'Description' };

    const mockGetAuthorByIdSuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('author_translations')
          .select('name, description')
          .match({ id: authorId, language_code: languageCode })
          .maybeSingle as jest.Mock
      ).mockResolvedValueOnce({
        data: mockAuthorData,
      });

    const mockGetAuthorByIdFailure = () =>
      (
        mockSupabaseService
          .getClient()
          .from('author_translations')
          .select('name, description')
          .match({ id: authorId, language_code: languageCode })
          .maybeSingle as jest.Mock
      ).mockResolvedValueOnce({
        error: new Error('Database error'),
      });

    it("should return the author's data from the provided ID", async () => {
      mockGetAuthorByIdSuccess();

      const result = await service.getAuthorById(authorId, languageCode);

      expect(result).toEqual(mockAuthorData);
    });

    it('should throw an InternalServerErrorException when an error occurs', async () => {
      mockGetAuthorByIdFailure();

      await expect(
        service.getAuthorById(authorId, languageCode),
      ).rejects.toThrow();

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('getAuthorFromSummaryId', () => {
    const summaryId = 1;
    const languageCode = 'en';
    const mockSummaryData = { authors: { id: 1 } };
    const mockAuthorData = { name: 'Author Name', description: 'Description' };

    const mockGetSummaryByIdSuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('summaries')
          .select('authors(id)')
          .eq('id', summaryId).single as jest.Mock
      ).mockResolvedValueOnce({
        data: mockSummaryData,
      });

    const mockGetSummaryByIdFailure = () =>
      (
        mockSupabaseService
          .getClient()
          .from('summaries')
          .select('authors(id)')
          .eq('id', summaryId).single as jest.Mock
      ).mockResolvedValueOnce({
        error: new Error('Summary not found'),
      });

    const mockGetAuthorDataSuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('author_translations')
          .select('name, description')
          .match({
            author_id: mockSummaryData.authors.id,
            language_code: languageCode,
          }).single as jest.Mock
      ).mockResolvedValueOnce({
        data: mockAuthorData,
      });

    const mockGetAuthorDataFailure = () =>
      (
        mockSupabaseService
          .getClient()
          .from('author_translations')
          .select('name, description')
          .match({
            author_id: mockSummaryData.authors.id,
            language_code: languageCode,
          }).single as jest.Mock
      ).mockResolvedValueOnce({
        error: new Error('Author data error'),
      });

    it("should return the author's data from the provided summary ID", async () => {
      mockGetSummaryByIdSuccess();
      mockGetAuthorDataSuccess();

      const result = await service.getAuthorFromSummaryId(
        summaryId,
        languageCode,
      );

      expect(result).toEqual(mockAuthorData);
    });

    it('should return a NotFoundException when the summary is not found', async () => {
      mockGetSummaryByIdFailure();

      await expect(
        service.getAuthorFromSummaryId(summaryId, languageCode),
      ).rejects.toThrow();
    });

    it('should throw an InternalServerErrorException when an error occurs', async () => {
      mockGetSummaryByIdSuccess();
      mockGetAuthorDataFailure();

      await expect(
        service.getAuthorFromSummaryId(summaryId, languageCode),
      ).rejects.toThrow();

      expect(console.error).toHaveBeenCalled();
    });
  });
});
