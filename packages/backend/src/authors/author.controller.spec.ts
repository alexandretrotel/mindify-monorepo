import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsController } from './authors.controller';
import { AuthorsService } from './authors.service';
import { mockAuthorsService } from 'src/common/__mocks__/authors.service';

describe('AuthorsController', () => {
  let authorsController: AuthorsController;
  let authorsService: AuthorsService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthorsController],
      providers: [
        {
          provide: AuthorsService,
          useValue: mockAuthorsService,
        },
      ],
    }).compile();

    authorsController = app.get<AuthorsController>(AuthorsController);
    authorsService = app.get<AuthorsService>(AuthorsService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAuthors', () => {
    it('should return authors', async () => {
      const languageCode = 'fr';
      const authors = [
        {
          name: 'John Doe',
          description: 'A great author',
        },
      ];

      jest.spyOn(authorsService, 'getAuthors').mockResolvedValueOnce(authors);

      expect(await authorsController.getAuthors({ languageCode })).toBe(
        authors,
      );
      expect(authorsService.getAuthors).toHaveBeenCalledWith(languageCode);
    });
  });

  describe('getAuthorsFromIds', () => {
    it('should return authors from ids', async () => {
      const languageCode = 'fr';
      const ids = [1, 2];
      const authors = [
        {
          name: 'John Doe',
          description: 'A great author',
        },
      ];

      jest
        .spyOn(authorsService, 'getAuthorsFromIds')
        .mockResolvedValueOnce(authors);

      expect(
        await authorsController.getAuthorsFromIds({ ids, languageCode }),
      ).toBe(authors);
      expect(authorsService.getAuthorsFromIds).toHaveBeenCalledWith(
        ids,
        languageCode,
      );
    });
  });
});
