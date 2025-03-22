import { Test, TestingModule } from '@nestjs/testing';
import { SrsService } from './srs.service';
import { SupabaseService } from '../common/supabase';
import { ConfigService } from '@nestjs/config';
import { mockSupabaseService } from 'src/common/__mocks__/supabase';
import { Rating } from 'ts-fsrs';

jest.spyOn(console, 'error').mockImplementation(() => {});

describe('SrsService', () => {
  let service: SrsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SrsService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
        ConfigService,
      ],
    }).compile();

    service = module.get<SrsService>(SrsService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateSrsData', () => {
    const mindId = 1;
    const userId = '1';
    const grade = Rating.Good;

    const mockGetSrsDataSuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('srs_data')
          .select('*')
          .match({ user_id: userId, mind_id: mindId }).maybeSingle as jest.Mock
      ).mockResolvedValueOnce({ data: null, error: null });

    const mockGetSrsDataFailure = () =>
      (
        mockSupabaseService
          .getClient()
          .from('srs_data')
          .select('*')
          .match({ user_id: userId, mind_id: mindId }).maybeSingle as jest.Mock
      ).mockResolvedValueOnce({ data: null, error: 'error' });

    const mockInsertSrsDataSuccess = () =>
      (
        mockSupabaseService.getClient().from('srs_data').insert as jest.Mock
      ).mockResolvedValueOnce({ error: null });

    const mockInsertSrsDataFailure = () =>
      (
        mockSupabaseService.getClient().from('srs_data').insert as jest.Mock
      ).mockResolvedValueOnce({ error: 'error' });

    const mockUpsertSrsDataSuccess = () =>
      (
        mockSupabaseService.getClient().from('srs_data').upsert as jest.Mock
      ).mockResolvedValueOnce({ error: null });

    const mockUpsertSrsDataFailure = () =>
      (
        mockSupabaseService.getClient().from('srs_data').upsert as jest.Mock
      ).mockResolvedValueOnce({ error: 'error' });

    it('should throw an error if there is an error fetching srs data', async () => {
      mockGetSrsDataFailure();

      await expect(
        service.updateSrsData(mindId, userId, grade),
      ).rejects.toThrow();
    });

    it('should insert srs data if it does not exist', async () => {
      mockGetSrsDataSuccess();
      mockInsertSrsDataSuccess();

      const updatedCard = await service.updateSrsData(mindId, userId, grade);

      expect(updatedCard.card).toBeDefined();
    });

    it('should throw an error if there is an error inserting srs data', async () => {
      mockGetSrsDataSuccess();
      mockInsertSrsDataFailure();

      await expect(
        service.updateSrsData(mindId, userId, grade),
      ).rejects.toThrow();
    });

    it('should update srs data if it exists', async () => {
      mockGetSrsDataSuccess();
      mockUpsertSrsDataSuccess();

      const updatedCard = await service.updateSrsData(mindId, userId, grade);

      expect(updatedCard.card).toBeDefined();
    });

    it('should throw an error if there is an error updating srs data', async () => {
      mockGetSrsDataSuccess();
      mockUpsertSrsDataFailure();

      await expect(
        service.updateSrsData(mindId, userId, grade),
      ).rejects.toThrow();
    });
  });

  describe('postUserLearningSession', () => {
    const userId = '1';
    const totalTimeInMs = 1000;
    const totalLength = 10;

    const mockInsertLearningSessionSuccess = () =>
      (
        mockSupabaseService.getClient().from('learning_sessions')
          .insert as jest.Mock
      ).mockResolvedValueOnce({ error: null });

    const mockInsertLearningSessionFailure = () =>
      (
        mockSupabaseService.getClient().from('learning_sessions')
          .insert as jest.Mock
      ).mockResolvedValueOnce({ error: 'error' });

    it('should insert a learning session', async () => {
      mockInsertLearningSessionSuccess();

      await service.postUserLearningSession(totalTimeInMs, totalLength, userId);
    });

    it('should throw an error if there is an error inserting a learning session', async () => {
      mockInsertLearningSessionFailure();

      await expect(
        service.postUserLearningSession(totalTimeInMs, totalLength, userId),
      ).rejects.toThrow();
    });
  });

  describe('getSrsData', () => {
    const userId = '1';

    const mockGetSrsDataSuccess = () =>
      (
        mockSupabaseService
          .getClient()
          .from('srs_data')
          .select('*, minds(*, summaries(title, authors(name)))')
          .match as jest.Mock
      ).mockResolvedValueOnce({ data: [], error: null });

    const mockGetSrsDataFailure = () =>
      (
        mockSupabaseService
          .getClient()
          .from('srs_data')
          .select('*, minds(*, summaries(title, authors(name)))')
          .match as jest.Mock
      ).mockResolvedValueOnce({ data: null, error: 'error' });

    it('should fetch srs data', async () => {
      mockGetSrsDataSuccess();

      const srsData = await service.getSrsData(userId);

      expect(srsData).toBeDefined();
    });

    it('should throw an error if there is an error fetching srs data', async () => {
      mockGetSrsDataFailure();

      await expect(service.getSrsData(userId)).rejects.toThrow();
    });
  });
});
