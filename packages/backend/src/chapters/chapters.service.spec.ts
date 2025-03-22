import { Test, TestingModule } from '@nestjs/testing';
import { ChaptersService } from './chapters.service';
import { SupabaseService } from '../common/supabase';
import { mockSupabaseService } from 'src/common/__mocks__/supabase';
import { InternalServerErrorException } from '@nestjs/common';

jest.spyOn(console, 'error').mockImplementation(() => {});

describe('ChapterService', () => {
  let service: ChaptersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChaptersService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
      ],
    }).compile();

    service = module.get<ChaptersService>(ChaptersService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getChaptersFromId', () => {
    it('should return chapters', async () => {
      const chapterId = 1;
      const chapters = { titles: ['Title'], texts: ['Text'] };

      (
        mockSupabaseService
          .getClient()
          .from('chapter_translations')
          .select('titles, texts')
          .match({ chapter_id: chapterId, language_code: 'en' })
          .single as jest.Mock
      ).mockReturnValueOnce({
        data: chapters,
      });

      const result = await service.getChaptersFromId(chapterId, 'en');

      expect(result).toEqual(chapters);
    });

    it('should throw an error', async () => {
      const chapterId = 1;
      const error = new Error('An error occurred while fetching the chapters');
      (
        mockSupabaseService
          .getClient()
          .from('chapter_translations')
          .select('titles, texts')
          .match({ chapter_id: chapterId, language_code: 'en' })
          .single as jest.Mock
      ).mockReturnValueOnce({
        error,
      });

      await expect(service.getChaptersFromId(chapterId, 'en')).rejects.toThrow(
        new InternalServerErrorException(
          'An error occurred while fetching the chapters',
        ),
      );
    });
  });
});
