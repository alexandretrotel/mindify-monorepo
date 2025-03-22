import { Test, TestingModule } from '@nestjs/testing';
import { ChaptersController } from './chapters.controller';
import { ChaptersService } from './chapters.service';
import { mockChaptersService } from 'src/common/__mocks__/chapters.service';

describe('ChaptersController', () => {
  let controller: ChaptersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChaptersController],
      providers: [{ provide: ChaptersService, useValue: mockChaptersService }],
    }).compile();

    controller = module.get<ChaptersController>(ChaptersController);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getChaptersFromId', () => {
    it('should return the chapters from the service', async () => {
      const chapterId = 1;
      const chapters = [{ titles: ['Chapter 1'], texts: ['Text 1'] }];
      mockChaptersService.getChaptersFromId.mockResolvedValueOnce(chapters);

      expect(
        await controller.getChaptersFromId({
          id: chapterId,
          languageCode: 'en',
        }),
      ).toBe(chapters);
      expect(mockChaptersService.getChaptersFromId).toHaveBeenCalledWith(
        chapterId,
        'en',
      );
    });

    it('should throw an error when the service throws an error', async () => {
      const chapterId = 1;
      const error = new Error('Test error');
      mockChaptersService.getChaptersFromId.mockRejectedValueOnce(error);

      await expect(
        controller.getChaptersFromId({ id: chapterId, languageCode: 'en' }),
      ).rejects.toThrow(error);
    });
  });
});
