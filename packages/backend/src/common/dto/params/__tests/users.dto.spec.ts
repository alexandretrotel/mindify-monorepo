import { validate } from 'class-validator';
import { SearchUsersDto } from '../users.dto';

describe('SearchUsersDto Validation', () => {
  it('should pass validation for valid SearchUsersDto', async () => {
    const dto = new SearchUsersDto();
    dto.query = 'lorem ipsum';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation for invalid SearchUsersDto (empty query)', async () => {
    const dto = new SearchUsersDto();
    dto.query = '';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });
});
