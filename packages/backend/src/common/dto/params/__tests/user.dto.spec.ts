import { validate } from 'class-validator';
import { UserIdDto, UpdateProfileDto } from '../user.dto';

describe('User DTO Validation', () => {
  it('should pass validation for valid UserIdDto', async () => {
    const dto = new UserIdDto();
    dto.userId = '123e4567-e35b-12d3-a456-426614174000';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation for invalid UserIdDto (non-UUID)', async () => {
    const dto = new UserIdDto();
    dto.userId = 'invalid-uuid';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });

  it('should pass validation for valid UpdateProfileDto', async () => {
    const dto = new UpdateProfileDto();
    dto.username = 'username';
    dto.biography = 'biography';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation for invalid UpdateProfileDto (short username)', async () => {
    const dto = new UpdateProfileDto();
    dto.username = 'us';
    dto.biography = 'biography';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('minLength');
  });

  it('should fail validation for invalid UpdateProfileDto (short biography)', async () => {
    const dto = new UpdateProfileDto();
    dto.username = 'username';
    dto.biography = 'bio';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('minLength');
  });
});
