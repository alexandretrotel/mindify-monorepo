import { Test, TestingModule } from '@nestjs/testing';
import { MindifyAiService } from './mindify-ai.service';
import { SupabaseService } from '../common/supabase';
import { ConfigService } from '@nestjs/config';
import { mockSupabaseService } from 'src/common/__mocks__/supabase';

jest.spyOn(console, 'error').mockImplementation(() => null);

describe('MindifyAiService', () => {
  let service: MindifyAiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MindifyAiService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
        ConfigService,
      ],
    }).compile();

    service = module.get<MindifyAiService>(MindifyAiService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserTodayPromptsCount', () => {
    const mockUserId = 'user1';

    const mockGetChatsSuccess = () =>
      (
        mockSupabaseService.getClient().from('mindify_ai_chats').select('id')
          .eq as jest.Mock
      ).mockReturnValueOnce({
        data: [{ id: 'chat1' }],
      });

    const mockGetChatsNotFound = () =>
      (
        mockSupabaseService.getClient().from('mindify_ai_chats').select('id')
          .eq as jest.Mock
      ).mockReturnValueOnce({
        data: [],
      });

    const mockGetChatsError = () =>
      (
        mockSupabaseService.getClient().from('mindify_ai_chats').select('id')
          .eq as jest.Mock
      ).mockReturnValueOnce({
        error: 'error',
      });

    const mockGetMessagesSuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('mindify_ai_messages')
          .select('created_at')
          .in('chat_id', ['chat1']).gte as jest.Mock
      ).mockReturnValueOnce({
        count: 1,
      });

    const mockGetMessagesNotFound = () =>
      (
        mockSupabaseService
          .getClient()
          .from('mindify_ai_messages')
          .select('created_at')
          .in('chat_id', ['chat1']).gte as jest.Mock
      ).mockReturnValueOnce({
        count: 0,
      });

    const mockGetMessagesError = () =>
      (
        mockSupabaseService
          .getClient()
          .from('mindify_ai_messages')
          .select('created_at')
          .in('chat_id', ['chat1']).gte as jest.Mock
      ).mockReturnValueOnce({
        error: 'error',
      });

    it('should return the count of messages for today', async () => {
      mockGetChatsSuccess();
      mockGetMessagesSuccess();

      const result = await service.getUserTodayPromptsCount(mockUserId);

      expect(result).toEqual({ count: 1 });
    });

    it('should throw an error if an error occurs while fetching the user chats', async () => {
      mockGetChatsError();

      await expect(
        service.getUserTodayPromptsCount(mockUserId),
      ).rejects.toThrow("An error occurred while fetching the user's chats.");
    });

    it('should throw an error if no chats are found for the user', async () => {
      mockGetChatsNotFound();

      await expect(
        service.getUserTodayPromptsCount(mockUserId),
      ).rejects.toThrow('No chats found for the user.');
    });

    it('should throw an error if an error occurs while fetching the messages', async () => {
      mockGetChatsSuccess();
      mockGetMessagesError();

      await expect(
        service.getUserTodayPromptsCount(mockUserId),
      ).rejects.toThrow('An error occurred while fetching the messages.');
    });

    it('should return 0 if no messages are found for today', async () => {
      mockGetChatsSuccess();
      mockGetMessagesNotFound();

      const result = await service.getUserTodayPromptsCount(mockUserId);

      expect(result).toEqual({ count: 0 });
    });
  });

  describe('createChat', () => {
    const mockUserId = 'user1';
    const mockChatId = 1;
    const mockChatResult = {
      id: mockChatId,
      user_id: mockUserId,
    };

    const mockCreateChatSuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('mindify_ai_chats')
          .insert({ user_id: mockUserId })
          .select().single as jest.Mock
      ).mockReturnValueOnce({
        data: mockChatResult,
      });

    const mockCreateChatError = () =>
      (
        mockSupabaseService
          .getClient()
          .from('mindify_ai_chats')
          .insert({ user_id: mockUserId })
          .select().single as jest.Mock
      ).mockReturnValueOnce({
        error: 'error',
      });

    it("should create a chat for the user and return the chat's id", async () => {
      mockCreateChatSuccess();

      const result = await service.createChat(mockUserId);

      expect(result).toBe(mockChatResult);
    });

    it('should throw an error if an error occurs while creating the chat', async () => {
      mockCreateChatError();

      await expect(service.createChat(mockUserId)).rejects.toThrow(
        'An error occurred while creating the chat.',
      );
    });
  });

  describe('deleteAllMessages', () => {
    const mockUserId = 'user1';
    const mockChatId = 1;

    const mockDeleteMessagesSuccess = () =>
      (
        mockSupabaseService.getClient().from('mindify_ai_chats').delete()
          .match as jest.Mock
      ).mockReturnValueOnce({});

    const mockDeleteMessagesError = () =>
      (
        mockSupabaseService.getClient().from('mindify_ai_chats').delete()
          .match as jest.Mock
      ).mockReturnValueOnce({
        error: 'error',
      });

    it("should delete all messages for the user's chat", async () => {
      mockDeleteMessagesSuccess();

      const result = await service.deleteAllMessages(mockUserId, mockChatId);

      expect(result).toEqual({
        success: true,
        message: 'All messages have been successfully deleted.',
      });
    });

    it('should throw an error if an error occurs while deleting the chat', async () => {
      mockDeleteMessagesError();

      await expect(
        service.deleteAllMessages(mockUserId, mockChatId),
      ).rejects.toThrow('An error occurred while deleting the chat.');
    });
  });

  describe('fetchChatId', () => {
    const mockUserId = 'user1';
    const mockChatId = 1;
    const mockChatResult = {
      id: mockChatId,
    };

    const mockFetchChatIdSuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('mindify_ai_chats')
          .select('id')
          .eq('user_id', mockUserId).single as jest.Mock
      ).mockReturnValueOnce({
        data: mockChatResult,
      });

    const mockFetchChatIdNotFound = () =>
      (
        mockSupabaseService
          .getClient()
          .from('mindify_ai_chats')
          .select('id')
          .eq('user_id', mockUserId).single as jest.Mock
      ).mockReturnValueOnce({
        error: 'error',
      });

    const mockFetchChatIdError = () =>
      (
        mockSupabaseService
          .getClient()
          .from('mindify_ai_chats')
          .select('id')
          .eq('user_id', mockUserId).single as jest.Mock
      ).mockReturnValueOnce({
        error: 'error',
      });

    it('should return the chat id for the user', async () => {
      mockFetchChatIdSuccess();

      const result = await service.fetchChatId(mockUserId);

      expect(result).toEqual({ id: mockChatId });
    });

    it('should throw an error if an error occurs while fetching the chat id', async () => {
      mockFetchChatIdError();

      await expect(service.fetchChatId(mockUserId)).rejects.toThrow(
        'An error occurred while fetching the chat id.',
      );
    });

    it('should throw an error if no chat is found for the user', async () => {
      mockFetchChatIdNotFound();

      await expect(service.fetchChatId(mockUserId)).rejects.toThrow(
        'An error occurred while fetching the chat id.',
      );
    });
  });
});
