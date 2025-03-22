import { validate } from 'class-validator';
import { TopicIdDto, TopicIdLanguageDto } from '../topic.dto';

describe('DTO Validation', () => {
  it('should pass validation for valid TopicIdDto', async () => {
    const dto = new TopicIdDto();
    dto.topicId = 1;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation for invalid TopicIdDto (non-integer topicId)', async () => {
    const dto = new TopicIdDto();
    dto.topicId = 'invalid' as unknown as number;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isInt');
  });

  it('should pass validation for valid TopicIdLanguageDto', async () => {
    const dto = new TopicIdLanguageDto();
    dto.languageCode = 'en';
    dto.topicId = 1;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation for invalid TopicIdLanguageDto (non-string languageCode)', async () => {
    const dto = new TopicIdLanguageDto();
    dto.languageCode = 123 as unknown as string;
    dto.topicId = 1;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should fail validation for invalid TopicIdLanguageDto (non-integer topicId)', async () => {
    const dto = new TopicIdLanguageDto();
    dto.languageCode = 'en';
    dto.topicId = 'invalid' as unknown as number;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isInt');
  });
});
