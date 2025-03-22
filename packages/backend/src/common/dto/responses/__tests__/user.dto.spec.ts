import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  UserMetadataDto,
  UserLevelDto,
  UserFriendDto,
  UserFriendIdsDto,
  UserPendingFriendsIdsDto,
  SearchUserDto,
} from '../user.dto';
import { UserMetadata } from '@supabase/supabase-js';

describe('UserMetadataDto Validation Tests', () => {
  it('should validate a valid UserMetadataDto instance', async () => {
    const input = {
      metadata: {
        email: 'user@example.com',
        full_name: 'John Doe',
        avatar_url: 'https://example.com/avatar.png',
      } as UserMetadata,
    };
    const dto = plainToInstance(UserMetadataDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should return validation errors for invalid UserMetadataDto input', async () => {
    const input = {
      metadata: 'invalid data',
    };
    const dto = plainToInstance(UserMetadataDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('UserLevelDto Validation Tests', () => {
  it('should validate a valid UserLevelDto instance', async () => {
    const input = {
      xp: 100,
      level: 5,
      xp_for_next_level: 200,
      xp_of_current_level: 150,
      progression: 0.75,
    };
    const dto = plainToInstance(UserLevelDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should return validation errors for invalid UserLevelDto input', async () => {
    const input = {
      xp: 'invalid',
      level: 'invalid',
      xp_for_next_level: 'invalid',
      xp_of_current_level: 'invalid',
      progression: 'invalid',
    };
    const dto = plainToInstance(UserLevelDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('UserFriendDto Validation Tests', () => {
  it('should validate a valid UserFriendDto instance', async () => {
    const input = {
      created_at: '2021-10-10T10:10:10.000Z',
      friend_id: '123e4567-e45b-12d3-a456-426614174000',
      raw_user_meta_data: { key: 'value' },
    };
    const dto = plainToInstance(UserFriendDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should return validation errors for invalid UserFriendDto input', async () => {
    const input = {
      created_at: 'invalid date',
      friend_id: 'invalid-uuid',
      raw_user_meta_data: 'invalid json',
    };
    const dto = plainToInstance(UserFriendDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('UserFriendIdsDto Validation Tests', () => {
  it('should validate a valid UserFriendIdsDto instance', async () => {
    const input = {
      friendsIds: ['123e4567-e456-12d3-a456-426614174000'],
      askedFriendsIds: ['123e4567-e456-12d3-a456-426614174001'],
      requestedFriendsIds: ['123e4567-e456-12d3-a456-426614174002'],
    };
    const dto = plainToInstance(UserFriendIdsDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should return validation errors for invalid UserFriendIdsDto input', async () => {
    const input = {
      friendsIds: ['invalid-uuid'],
      askedFriendsIds: ['invalid-uuid'],
      requestedFriendsIds: ['invalid-uuid'],
    };
    const dto = plainToInstance(UserFriendIdsDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('UserPendingFriendsIdsDto Validation Tests', () => {
  it('should validate a valid UserPendingFriendsIdsDto instance', async () => {
    const input = {
      pendingFriendsIds: ['123e4567-e456-12d3-a456-426614174000'],
    };
    const dto = plainToInstance(UserPendingFriendsIdsDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should return validation errors for invalid UserPendingFriendsIdsDto input', async () => {
    const input = {
      pendingFriendsIds: ['invalid-uuid'],
    };
    const dto = plainToInstance(UserPendingFriendsIdsDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('SearchUserDto Validation Tests', () => {
  it('should validate a valid SearchUserDto instance', async () => {
    const input = {
      id: '123e4567-e456-12d3-a456-426614174000',
      name: 'username',
      avatar: 'https://example.com/avatar.png',
    };
    const dto = plainToInstance(SearchUserDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should return validation errors for invalid SearchUserDto input', async () => {
    const input = {
      id: 'invalid-uuid',
      name: 123,
      avatar: 'invalid-url',
    };
    const dto = plainToInstance(SearchUserDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
