import { Test, TestingModule } from '@nestjs/testing';
import { MindService } from './mind.service';
import { SupabaseService } from '../common/supabase';
import { ConfigService } from '@nestjs/config';
import { mockSupabaseService } from 'src/common/__mocks__/supabase';

jest.spyOn(console, 'error').mockImplementation(() => {});

describe('MindService', () => {
  let service: MindService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MindService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
        ConfigService,
      ],
    }).compile();

    service = module.get<MindService>(MindService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveMind', () => {
    const mockUserId = 'user1';

    const mockSaveMindSuccess = () =>
      (
        mockSupabaseService.getClient().from('saved_minds').insert as jest.Mock
      ).mockReturnValueOnce({
        error: null,
      });

    const mockSaveMindError = () =>
      (
        mockSupabaseService.getClient().from('saved_minds').insert as jest.Mock
      ).mockReturnValueOnce({
        error: new Error(),
      });

    it('should save a mind', async () => {
      mockSaveMindSuccess();

      const result = await service.saveMind(mockUserId, 1);

      expect(result).toEqual({
        success: true,
        message: 'The mind has been saved successfully.',
      });
    });

    it('should throw an error if an error occurs while saving the mind', async () => {
      mockSaveMindError();

      await expect(service.saveMind(mockUserId, 1)).rejects.toThrow(
        'An error occurred while saving the mind.',
      );
    });
  });

  describe('unsaveMind', () => {
    const mockUserId = 'user1';

    const mockUnsaveMindSuccess = () =>
      (
        mockSupabaseService.getClient().from('saved_minds').delete()
          .match as jest.Mock
      ).mockReturnValueOnce({
        error: null,
      });

    const mockUnsaveMindError = () =>
      (
        mockSupabaseService.getClient().from('saved_minds').delete()
          .match as jest.Mock
      ).mockReturnValueOnce({
        error: new Error(),
      });

    it('should unsave a mind', async () => {
      mockUnsaveMindSuccess();

      const result = await service.unsaveMind(mockUserId, 1);

      expect(result).toEqual({
        success: true,
        message: 'The mind has been unsaved successfully.',
      });
    });

    it('should throw an error if an error occurs while unsaving the mind', async () => {
      mockUnsaveMindError();

      await expect(service.unsaveMind(mockUserId, 1)).rejects.toThrow(
        'An error occurred while unsaving the mind.',
      );
    });
  });

  describe('likeMind', () => {
    const mockMindId = 1;
    const mockUserId = 'user1';

    const mockLikeMindSuccess = () =>
      (
        mockSupabaseService.getClient().from('liked_minds').insert as jest.Mock
      ).mockReturnValueOnce({
        error: null,
      });

    const mockLikeMindError = () =>
      (
        mockSupabaseService.getClient().from('liked_minds').insert as jest.Mock
      ).mockReturnValueOnce({
        error: new Error(),
      });

    it('should like a mind', async () => {
      mockLikeMindSuccess();

      const result = await service.likeMind(mockUserId, mockMindId);

      expect(result).toEqual({
        success: true,
        message: 'The mind has been liked successfully.',
      });
    });

    it('should throw an error if an error occurs while liking the mind', async () => {
      mockLikeMindError();

      await expect(service.likeMind(mockUserId, mockMindId)).rejects.toThrow(
        'An error occurred while liking the mind.',
      );
    });
  });

  describe('unlikeMind', () => {
    const mockMindId = 1;
    const mockUserId = 'user1';

    const mockUnlikeMindSuccess = () =>
      (
        mockSupabaseService.getClient().from('liked_minds').delete()
          .match as jest.Mock
      ).mockReturnValueOnce({
        error: null,
      });

    const mockUnlikeMindError = () =>
      (
        mockSupabaseService.getClient().from('liked_minds').delete()
          .match as jest.Mock
      ).mockReturnValueOnce({
        error: new Error(),
      });

    it('should unlike a mind', async () => {
      mockUnlikeMindSuccess();

      const result = await service.unlikeMind(mockUserId, mockMindId);

      expect(result).toEqual({
        success: true,
        message: 'The mind has been unliked successfully.',
      });
    });

    it('should throw an error if an error occurs while unliking the mind', async () => {
      mockUnlikeMindError();

      await expect(service.unlikeMind(mockUserId, mockMindId)).rejects.toThrow(
        'An error occurred while unliking the mind.',
      );
    });
  });

  describe('isMindSaved', () => {
    const mockMindId = 1;
    const mockUserId = 'user1';

    const mockIsMindSavedSuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('saved_minds')
          .select('mind_id')
          .match({
            mind_id: mockMindId,
            user_id: mockUserId,
          }).maybeSingle as jest.Mock
      ).mockReturnValueOnce({
        data: { mind_id: mockMindId },
        error: null,
      });

    const mockIsMindSavedError = () =>
      (
        mockSupabaseService
          .getClient()
          .from('saved_minds')
          .select('mind_id')
          .match({
            mind_id: mockMindId,
            user_id: mockUserId,
          }).maybeSingle as jest.Mock
      ).mockReturnValueOnce({
        data: null,
        error: new Error(),
      });

    it('should return true if the mind is saved by the user', async () => {
      mockIsMindSavedSuccess();

      const result = await service.isMindSaved(mockUserId, mockMindId);

      expect(result).toEqual({ value: true });
    });

    it('should return false if the mind is not saved by the user', async () => {
      mockIsMindSavedSuccess();

      const result = await service.isMindSaved(mockUserId, 3);

      expect(result).toEqual({ value: false });
    });

    it('should throw an error if an error occurs while checking if the mind is saved', async () => {
      mockIsMindSavedError();

      await expect(service.isMindSaved(mockUserId, mockMindId)).rejects.toThrow(
        'An error occurred while checking if the mind is saved.',
      );
    });
  });

  describe('isMindLiked', () => {
    const mockMindId = 1;
    const mockUserId = 'user1';

    const mockIsMindLikedSuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('liked_minds')
          .select('mind_id')
          .match({
            mind_id: mockMindId,
            user_id: mockUserId,
          }).maybeSingle as jest.Mock
      ).mockReturnValueOnce({
        data: { mind_id: mockMindId },
        error: null,
      });

    const mockIsMindLikedError = () =>
      (
        mockSupabaseService
          .getClient()
          .from('liked_minds')
          .select('mind_id')
          .match({
            mind_id: mockMindId,
            user_id: mockUserId,
          }).maybeSingle as jest.Mock
      ).mockReturnValueOnce({
        data: null,
        error: new Error(),
      });

    it('should return true if the mind is liked by the user', async () => {
      mockIsMindLikedSuccess();

      const result = await service.isMindLiked(mockUserId, mockMindId);

      expect(result).toEqual({ value: true });
    });

    it('should return false if the mind is not liked by the user', async () => {
      mockIsMindLikedSuccess();

      const result = await service.isMindLiked(mockUserId, 3);

      expect(result).toEqual({ value: false });
    });

    it('should throw an error if an error occurs while checking if the mind is liked', async () => {
      mockIsMindLikedError();

      await expect(service.isMindLiked(mockUserId, mockMindId)).rejects.toThrow(
        'An error occurred while checking if the mind is liked.',
      );
    });
  });

  describe('getSavedMindCount', () => {
    const mockMindId = 1;

    const mockGetSavedMindCountSuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('saved_minds')
          .select('mind_id, minds(production)', {
            count: 'exact',
            head: true,
          }).match as jest.Mock
      ).mockReturnValueOnce({
        count: 5,
        error: null,
      });

    const mockGetSavedMindNotSaved = () =>
      (
        mockSupabaseService
          .getClient()
          .from('saved_minds')
          .select('mind_id, minds(production)', {
            count: 'exact',
            head: true,
          }).match as jest.Mock
      ).mockReturnValueOnce({
        count: 0,
        error: null,
      });

    const mockGetSavedMindCountError = () =>
      (
        mockSupabaseService
          .getClient()
          .from('saved_minds')
          .select('mind_id, minds(production)', { count: 'exact', head: true })
          .match as jest.Mock
      ).mockReturnValueOnce({
        count: null,
        error: new Error(),
      });

    it('should return the number of minds saved by the user', async () => {
      mockGetSavedMindCountSuccess();

      const result = await service.getSavedMindCount(mockMindId);

      expect(result).toEqual({ count: 5 });
    });

    it("should return 0 if the user hasn't saved any minds", async () => {
      mockGetSavedMindNotSaved();

      const result = await service.getSavedMindCount(3);

      expect(result).toEqual({ count: 0 });
    });

    it('should throw an error if an error occurs while fetching the saved minds', async () => {
      mockGetSavedMindCountError();

      await expect(service.getSavedMindCount(mockMindId)).rejects.toThrow(
        'An error occurred while fetching the saved minds count.',
      );
    });
  });

  describe('getLikedMindCount', () => {
    const mockMindId = 1;

    const mockGetLikedMindCountSuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('liked_minds')
          .select('mind_id, minds(production)', {
            count: 'exact',
            head: true,
          }).match as jest.Mock
      ).mockReturnValueOnce({
        count: 5,
        error: null,
      });

    const mockGetLikedMindNotLiked = () =>
      (
        mockSupabaseService
          .getClient()
          .from('liked_minds')
          .select('mind_id, minds(production)', {
            count: 'exact',
            head: true,
          }).match as jest.Mock
      ).mockReturnValueOnce({
        count: 0,
        error: null,
      });

    const mockGetLikedMindCountError = () =>
      (
        mockSupabaseService
          .getClient()
          .from('liked_minds')
          .select('mind_id, minds(production)', { count: 'exact', head: true })
          .match as jest.Mock
      ).mockReturnValueOnce({
        count: null,
        error: new Error(),
      });

    it('should return the number of minds liked by the user', async () => {
      mockGetLikedMindCountSuccess();

      const result = await service.getLikedMindCount(mockMindId);

      expect(result).toEqual({ count: 5 });
    });

    it("should return 0 if the user hasn't liked any minds", async () => {
      mockGetLikedMindNotLiked();

      const result = await service.getLikedMindCount(3);

      expect(result).toEqual({ count: 0 });
    });

    it('should throw an error if an error occurs while fetching the liked minds', async () => {
      mockGetLikedMindCountError();

      await expect(service.getLikedMindCount(mockMindId)).rejects.toThrow(
        'An error occurred while fetching the liked minds count.',
      );
    });
  });
});
