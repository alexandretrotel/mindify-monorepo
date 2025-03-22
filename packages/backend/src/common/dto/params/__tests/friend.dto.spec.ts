import { validate } from 'class-validator';
import { FriendRequestDto } from '../friend.dto';

describe('FriendRequestDto', () => {
  it('should validate successfully when userId and profileId are valid UUIDs and different from each other', async () => {
    const dto = new FriendRequestDto();
    dto.userId = '123e4567-e89b-12d3-a456-426614174000';
    dto.profileId = '456e4567-e89b-12d3-a456-426614174000';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation if userId is not a valid UUID', async () => {
    const dto = new FriendRequestDto();
    dto.userId = 'invalid-uuid';
    dto.profileId = '123e4567-e3b-12d3-a456-426614174000';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });

  it('should fail validation if profileId is not a valid UUID', async () => {
    const dto = new FriendRequestDto();
    dto.userId = '123e4567-e89b-12d3-a456-426614174000';
    dto.profileId = 'invalid-uuid';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });

  it('should fail validation if userId is empty', async () => {
    const dto = new FriendRequestDto();
    dto.userId = '';
    dto.profileId = '123e4567-e3b-12d3-a456-426614174000';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail validation if profileId is empty', async () => {
    const dto = new FriendRequestDto();
    dto.userId = '123e4567-e89b-12d3-a456-426614174000';
    dto.profileId = '';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });
});
