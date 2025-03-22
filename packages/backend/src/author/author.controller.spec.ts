import { Test, TestingModule } from '@nestjs/testing';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';
import { mockAuthorService } from 'src/common/__mocks__/author.service';

describe('AuthorController', () => {
  let authorController: AuthorController;
  let authorService: AuthorService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthorController],
      providers: [
        {
          provide: AuthorService,
          useValue: mockAuthorService,
        },
      ],
    }).compile();

    authorController = app.get<AuthorController>(AuthorController);
    authorService = app.get<AuthorService>(AuthorService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAuthorById', () => {
    it('should return author data', async () => {
      const authorId = 1;
      const languageCode = 'fr';

      (authorService.getAuthorById as jest.Mock).mockResolvedValueOnce({
        id: authorId,
        name: 'John Doe',
        description: 'A great author',
      });

      const result = await authorController.getAuthorById({
        id: authorId,
        languageCode,
      });

      expect(result).toEqual({
        id: authorId,
        name: 'John Doe',
        description: 'A great author',
      });
    });

    it('should throw an error if the author data cannot be fetched', async () => {
      const authorId = 1;
      const languageCode = 'fr';

      (authorService.getAuthorById as jest.Mock).mockRejectedValueOnce(
        new Error('An error occurred while fetching the author data.'),
      );

      await expect(
        authorController.getAuthorById({
          id: authorId,
          languageCode,
        }),
      ).rejects.toThrow('An error occurred while fetching the author data.');

      expect(authorService.getAuthorById).toHaveBeenCalledWith(
        authorId,
        languageCode,
      );
    });
  });

  describe('getAuthorFromSummaryId', () => {
    it('should return author data', async () => {
      const summaryId = 1;
      const languageCode = 'fr';

      (authorService.getAuthorFromSummaryId as jest.Mock).mockResolvedValueOnce(
        {
          id: 1,
          name: 'John Doe',
          description: 'A great author',
        },
      );

      const result = await authorController.getAuthorFromSummaryId({
        id: summaryId,
        languageCode,
      });

      expect(result).toEqual({
        id: 1,
        name: 'John Doe',
        description: 'A great author',
      });
    });

    it('should throw an error if the author data cannot be fetched', async () => {
      const summaryId = 1;
      const languageCode = 'fr';

      (authorService.getAuthorFromSummaryId as jest.Mock).mockRejectedValueOnce(
        new Error('An error occurred while fetching the author data.'),
      );

      await expect(
        authorController.getAuthorFromSummaryId({
          id: summaryId,
          languageCode,
        }),
      ).rejects.toThrow('An error occurred while fetching the author data.');
    });
  });
});
