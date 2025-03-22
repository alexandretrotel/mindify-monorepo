import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsService } from './authors.service';
import { SupabaseService } from '../common/supabase';
import { ConfigService } from '@nestjs/config';
import { mockSupabaseService } from 'src/common/__mocks__/supabase';
import { InternalServerErrorException } from '@nestjs/common';

jest.spyOn(console, 'error').mockImplementation();

describe('AuthorsService', () => {
  let service: AuthorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorsService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
        ConfigService,
      ],
    }).compile();

    service = module.get<AuthorsService>(AuthorsService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAuthorsFromIds', () => {
    const authorsIds = [1, 2];
    const languageCode = 'en';
    const mockAuthorsData = [
      { name: 'Author 1', description: 'Description 1' },
      { name: 'Author 2', description: 'Description 2' },
    ];

    const mockGetAuthorsFromIdsSuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('author_translations')
          .select('name, description')
          .eq('language_code', languageCode).in as jest.Mock
      ).mockResolvedValueOnce({
        data: mockAuthorsData,
      });

    const mockGetAuthorsFromIdsFailure = () =>
      (
        mockSupabaseService
          .getClient()
          .from('author_translations')
          .select('name, description')
          .eq('language_code', languageCode).in as jest.Mock
      ).mockResolvedValueOnce({
        error: new Error('Database error'),
      });

    it("should return the authors' data from the provided IDs", async () => {
      mockGetAuthorsFromIdsSuccess();

      const authors = await service.getAuthorsFromIds(authorsIds, languageCode);

      expect(authors).toEqual(mockAuthorsData);
    });

    it("should throw an InternalServerErrorException if an error occurs while fetching the authors' data from the provided IDs", async () => {
      mockGetAuthorsFromIdsFailure();

      await expect(
        service.getAuthorsFromIds(authorsIds, languageCode),
      ).rejects.toThrow(
        new InternalServerErrorException(
          "An error occurred while fetching the authors' data from the provided IDs.",
        ),
      );
    });
  });

  describe('getAuthors', () => {
    const languageCode = 'en';
    const mockAuthorsData = [
      { name: 'Author 1', description: 'Description 1' },
      { name: 'Author 2', description: 'Description 2' },
    ];

    const mockGetAuthorsSuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('author_translations')
          .select('name, description').eq as jest.Mock
      ).mockResolvedValueOnce({
        data: mockAuthorsData,
      });

    const mockGetAuthorsFailure = () =>
      (
        mockSupabaseService
          .getClient()
          .from('author_translations')
          .select('name, description').eq as jest.Mock
      ).mockResolvedValueOnce({
        error: new Error('Database error'),
      });

    it("should return the authors' data", async () => {
      mockGetAuthorsSuccess();

      const authors = await service.getAuthors(languageCode);

      expect(authors).toEqual(mockAuthorsData);
    });

    it("should throw an InternalServerErrorException if an error occurs while fetching the authors' data", async () => {
      mockGetAuthorsFailure();

      await expect(service.getAuthors(languageCode)).rejects.toThrow(
        new InternalServerErrorException(
          "An error occurred while fetching the authors' data.",
        ),
      );
    });
  });
});
