import { validate } from 'class-validator';
import { UpdatePasswordDto } from '../auth.dto';

describe('UpdatePasswordDto', () => {
  it('should pass validation with valid data', async () => {
    const dto = new UpdatePasswordDto();
    dto.newPassword = 'validPassword123';
    dto.confirmPassword = 'validPassword123';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if newPassword is shorter than 8 characters', async () => {
    const dto = new UpdatePasswordDto();
    dto.newPassword = 'short';
    dto.confirmPassword = 'short';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.minLength).toBe(
      'Password must be at least 8 characters long',
    );
  });

  it('should fail if confirmPassword is shorter than 8 characters', async () => {
    const dto = new UpdatePasswordDto();
    dto.newPassword = 'validPassword';
    dto.confirmPassword = 'short';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.minLength).toBe(
      'Password must be at least 8 characters long',
    );
  });

  it('should fail if confirmPassword is missing', async () => {
    const dto = new UpdatePasswordDto();
    dto.newPassword = 'validPassword';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isString).toBeDefined();
  });
});
