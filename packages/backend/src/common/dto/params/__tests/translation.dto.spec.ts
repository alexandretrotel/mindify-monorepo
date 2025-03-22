import { validate } from 'class-validator';
import {
  LanguageCodeDto,
  LanguageCodeIdDto,
  LanguageCodeUserIdDto,
  LanguageCodeIdsDto,
} from '../translation.dto';

describe('Language Code DTO Validation', () => {
  it('should pass validation for valid LanguageCodeDto', async () => {
    const dto = new LanguageCodeDto();
    dto.languageCode = 'en';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation for invalid LanguageCodeDto (non-string)', async () => {
    const dto = new LanguageCodeDto();
    dto.languageCode = 123 as unknown as string;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should pass validation for valid LanguageCodeIdDto', async () => {
    const dto = new LanguageCodeIdDto();
    dto.languageCode = 'en';
    dto.id = 1;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation for invalid LanguageCodeIdDto (non-integer id)', async () => {
    const dto = new LanguageCodeIdDto();
    dto.languageCode = 'en';
    dto.id = 'invalid' as unknown as number;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isInt');
  });

  it('should pass validation for valid LanguageCodeUserIdDto', async () => {
    const dto = new LanguageCodeUserIdDto();
    dto.languageCode = 'en';
    dto.userId = '123e4567-e34b-12d3-a456-426614174000';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation for invalid LanguageCodeUserIdDto (non-UUID userId)', async () => {
    const dto = new LanguageCodeUserIdDto();
    dto.languageCode = 'en';
    dto.userId = 'invalid-uuid';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });

  it('should pass validation for valid LanguageCodeIdsDto', async () => {
    const dto = new LanguageCodeIdsDto();
    dto.languageCode = 'en';
    dto.ids = [1, 2, 3];

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation for invalid LanguageCodeIdsDto (non-array ids)', async () => {
    const dto = new LanguageCodeIdsDto();
    dto.languageCode = 'en';
    dto.ids = 'invalid' as unknown as number[];

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isArray');
  });

  it('should fail validation for invalid LanguageCodeIdsDto (non-numeric ids)', async () => {
    const dto = new LanguageCodeIdsDto();
    dto.languageCode = 'en';
    dto.ids = [1, 'invalid' as unknown as number, 3];

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNumber');
  });
});
