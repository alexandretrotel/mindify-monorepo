import { validate } from 'class-validator';
import { UpdateUserTopicsDto } from '../topics.dto';

describe('UpdateUserTopicsDto Validation', () => {
  it('should pass validation for valid UpdateUserTopicsDto', async () => {
    const dto = new UpdateUserTopicsDto();
    dto.userId = '123e4567-e35b-12d3-a456-426614174000';
    dto.selectedTopics = [1, 2, 3];

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation for invalid userId (non-UUID)', async () => {
    const dto = new UpdateUserTopicsDto();
    dto.userId = 'invalid-uuid';
    dto.selectedTopics = [1, 2, 3];

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });

  it('should fail validation for invalid selectedTopics (non-array)', async () => {
    const dto = new UpdateUserTopicsDto();
    dto.userId = '123e4567-e35b-12d3-a456-426614174000';
    dto.selectedTopics = 'invalid' as unknown as number[];

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isArray');
  });

  it('should fail validation for selectedTopics with non-numeric values', async () => {
    const dto = new UpdateUserTopicsDto();
    dto.userId = '123e4567-e43b-12d3-a456-426614174000';
    dto.selectedTopics = [1, 'invalid' as unknown as number, 3];

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isInt');
  });
});
