import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { LeaderboardDto, LeaderboardUserDto } from '../leaderboard.dto';

describe('Leaderboard DTO Validation Tests', () => {
  it('should validate a valid LeaderboardUserDto instance', async () => {
    const input = { user_id: '123e4567-e456-12d3-a456-426614174000', xp: 100 };
    const dto = plainToInstance(LeaderboardUserDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should return validation errors for invalid LeaderboardUserDto input', async () => {
    const input = { user_id: 'invalid-uuid', xp: 'not-a-number' };
    const dto = plainToInstance(LeaderboardUserDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should validate a valid LeaderboardDto instance', async () => {
    const input = {
      length: 10,
      leaderboard: [
        {
          user_id: '123e4567-e456-12d3-a456-426614174000',
          xp: 100,
        },
      ],
    };
    const dto = plainToInstance(LeaderboardDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should return validation errors for invalid LeaderboardDto input', async () => {
    const input = {
      length: 'not-a-number',
      leaderboard: [
        {
          user_id: 'invalid-uuid',
          xp: 'not-a-number',
        },
      ],
    };
    const dto = plainToInstance(LeaderboardDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should validate a LeaderboardDto instance with an empty leaderboard', async () => {
    const input = {
      length: 0,
      leaderboard: [],
    };
    const dto = plainToInstance(LeaderboardDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
