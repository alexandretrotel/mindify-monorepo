import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { FriendStatusDto } from '../friend.dto';

describe('FriendStatusDto', () => {
  it('should validate a valid FriendStatusDto instance', async () => {
    const input = {
      status: 'pending',
    };

    const friendStatusDto = plainToInstance(FriendStatusDto, input);
    const errors = await validate(friendStatusDto);

    expect(errors.length).toBe(0);
  });

  it('should return validation errors for invalid input', async () => {
    const input = {
      status: 123, // Invalid type
    };

    const friendStatusDto = plainToInstance(FriendStatusDto, input);
    const errors = await validate(friendStatusDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          property: 'status',
          constraints: {
            isString: 'status must be a string',
          },
        }),
      ]),
    );
  });
});
