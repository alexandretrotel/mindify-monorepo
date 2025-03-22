import { validate } from 'class-validator';
import { UpdateSrsDataDto, PostUserLearningSessionDto } from '../srs.dto';
import { Grade } from 'ts-fsrs';

describe('UpdateSrsDataDto', () => {
  it('should pass validation with valid mindId, userId, and grade', async () => {
    const dto = new UpdateSrsDataDto();
    dto.mindId = 1;
    dto.userId = '123e4567-e31b-12d3-a456-426614174000';
    dto.grade = 2 as Grade;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation if mindId is not an integer', async () => {
    const dto = new UpdateSrsDataDto();
    dto.mindId = 'invalid' as unknown as number;
    dto.userId = '123e4567-e31b-12d3-a456-426614174000';
    dto.grade = 1 as Grade;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isInt');
  });

  it('should fail validation if userId is not a UUID', async () => {
    const dto = new UpdateSrsDataDto();
    dto.mindId = 1;
    dto.userId = 'not-a-uuid';
    dto.grade = 3 as Grade;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });

  it('should fail validation if grade is not an integer', async () => {
    const dto = new UpdateSrsDataDto();
    dto.mindId = 1;
    dto.userId = '123e4567-e13b-12d3-a456-426614174000';
    dto.grade = 'invalid-grade' as unknown as Grade;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isInt');
  });
});

describe('PostUserLearningSessionDto', () => {
  it('should pass validation with valid totalTimeInMs, totalLength, and userId', async () => {
    const dto = new PostUserLearningSessionDto();
    dto.totalTimeInMs = 420000;
    dto.totalLength = 10;
    dto.userId = '123e4567-e45b-12d3-a456-426614174000';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation if totalTimeInMs is not an integer', async () => {
    const dto = new PostUserLearningSessionDto();
    dto.totalTimeInMs = 'invalid' as unknown as number;
    dto.totalLength = 10;
    dto.userId = '123e4567-e44b-12d3-a456-426614174000';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isInt');
  });

  it('should fail validation if totalLength is not an integer', async () => {
    const dto = new PostUserLearningSessionDto();
    dto.totalTimeInMs = 420000;
    dto.totalLength = 'invalid' as unknown as number;
    dto.userId = '123e4567-e43b-12d3-a456-426614174000';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isInt');
  });

  it('should fail validation if userId is not a UUID', async () => {
    const dto = new PostUserLearningSessionDto();
    dto.totalTimeInMs = 420000;
    dto.totalLength = 10;
    dto.userId = 'not-a-uuid';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });
});
