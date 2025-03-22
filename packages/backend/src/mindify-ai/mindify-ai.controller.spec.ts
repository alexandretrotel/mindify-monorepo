import { Test, TestingModule } from '@nestjs/testing';
import { MindifyAiController } from './mindify-ai.controller';
import { MindifyAiService } from './mindify-ai.service';
import { mockMindifyAiService } from 'src/common/__mocks__/mindify-ai.service';

describe('MindifyAiController', () => {
  let mindifyAiController: MindifyAiController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MindifyAiController],
      providers: [
        {
          provide: MindifyAiService,
          useValue: mockMindifyAiService,
        },
      ],
    }).compile();

    mindifyAiController = app.get<MindifyAiController>(MindifyAiController);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('deleteAllMessages', () => {
    it('should call deleteAllMessages', async () => {
      const userId = '1';
      const chatId = 1;

      await mindifyAiController.deleteAllMessages({ userId, chatId });

      expect(mockMindifyAiService.deleteAllMessages).toHaveBeenCalledWith(
        userId,
        chatId,
      );
    });
  });

  describe('fetchChatId', () => {
    it('should call fetchChatId', async () => {
      const userId = '1';

      await mindifyAiController.fetchChatId({ userId });

      expect(mockMindifyAiService.fetchChatId).toHaveBeenCalledWith(userId);
    });

    it("should throw an error if the chat ID doesn't exist", async () => {
      const userId = '1';

      (mockMindifyAiService.fetchChatId as jest.Mock).mockRejectedValueOnce(
        new Error('error'),
      );

      await expect(mindifyAiController.fetchChatId({ userId })).rejects.toThrow(
        new Error('error'),
      );
    });
  });

  describe('createChat', () => {
    it('should call createChat', async () => {
      const userId = '1';

      await mindifyAiController.createChat({ userId });

      expect(mockMindifyAiService.createChat).toHaveBeenCalledWith(userId);
    });

    it('should throw an error if the chat ID already exists', async () => {
      const userId = '1';

      (mockMindifyAiService.createChat as jest.Mock).mockRejectedValueOnce(
        new Error('error'),
      );

      await expect(mindifyAiController.createChat({ userId })).rejects.toThrow(
        new Error('error'),
      );
    });
  });

  describe('getUserTodayPromptsCount', () => {
    it('should call getUserTodayPromptsCount', async () => {
      const userId = '1';

      await mindifyAiController.getUserTodayPromptsCount({ userId });

      expect(
        mockMindifyAiService.getUserTodayPromptsCount,
      ).toHaveBeenCalledWith(userId);
    });

    it('should return the user today prompts count', async () => {
      const userId = '1';

      (
        mockMindifyAiService.getUserTodayPromptsCount as jest.Mock
      ).mockReturnValueOnce(0);

      const result = await mindifyAiController.getUserTodayPromptsCount({
        userId,
      });

      expect(result).toBe(0);
    });
  });
});
