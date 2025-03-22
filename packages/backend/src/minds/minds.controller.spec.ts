import { Test, TestingModule } from '@nestjs/testing';
import { MindsController } from './minds.controller';
import { MindsService } from './minds.service';
import { mockMindsService } from 'src/common/__mocks__/minds.service';

describe('MindsController', () => {
  let mindsController: MindsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MindsController],
      providers: [
        {
          provide: MindsService,
          useValue: mockMindsService,
        },
      ],
    }).compile();

    mindsController = app.get<MindsController>(MindsController);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('areMindsSaved', () => {
    const mindIds = [1, 2, 3];
    const userId = '123e4567-e3b-12d3-a456-426614174000';

    it("should return the result of 'areMindsSaved' method of mindsService", async () => {
      const result = await mindsController.areMindsSaved(mindIds, { userId });

      expect(result).toEqual(mockMindsService.areMindsSaved(mindIds, userId));
    });

    it('should call mindsService.areMindsSaved with correct arguments', async () => {
      await mindsController.areMindsSaved(mindIds, { userId });

      expect(mockMindsService.areMindsSaved).toHaveBeenCalledWith(
        mindIds,
        userId,
      );
      expect(mockMindsService.areMindsSaved).toHaveBeenCalledTimes(1);
    });
  });

  describe('areMindsLiked', () => {
    const mindIds = [1, 2, 3];
    const userId = '123e4567-e3b-12d3-a456-426614174000';

    it("should return the result of 'areMindsLiked' method of mindsService", async () => {
      const result = await mindsController.areMindsLiked(mindIds, { userId });

      expect(result).toEqual(mockMindsService.areMindsLiked(mindIds, userId));
    });

    it('should call mindsService.areMindsLiked with correct arguments', async () => {
      await mindsController.areMindsLiked(mindIds, { userId });

      expect(mockMindsService.areMindsLiked).toHaveBeenCalledWith(
        mindIds,
        userId,
      );
      expect(mockMindsService.areMindsLiked).toHaveBeenCalledTimes(1);
    });
  });

  describe('getSavedMindsCount', () => {
    const userId = '123e4567-e3b-12d3-a456-426614174000';

    it("should return the result of 'getSavedMindsCount' method of mindsService", async () => {
      const result = await mindsController.getSavedMindsCount({ userId });

      expect(result).toEqual(mockMindsService.getSavedMindsCount(userId));
    });

    it('should call mindsService.getSavedMindsCount with correct arguments', async () => {
      await mindsController.getSavedMindsCount({ userId });

      expect(mockMindsService.getSavedMindsCount).toHaveBeenCalledWith(userId);
      expect(mockMindsService.getSavedMindsCount).toHaveBeenCalledTimes(1);
    });
  });

  describe('getSavedMinds', () => {
    const userId = '123e4567-e3b-12d3-a456-426614174000';

    it("should return the result of 'getSavedMinds' method of mindsService", async () => {
      const result = await mindsController.getSavedMinds({ userId });

      expect(result).toEqual(mockMindsService.getSavedMinds(userId));
    });

    it('should call mindsService.getSavedMinds with correct arguments', async () => {
      await mindsController.getSavedMinds({ userId });

      expect(mockMindsService.getSavedMinds).toHaveBeenCalledWith(userId);
      expect(mockMindsService.getSavedMinds).toHaveBeenCalledTimes(1);
    });
  });
});
