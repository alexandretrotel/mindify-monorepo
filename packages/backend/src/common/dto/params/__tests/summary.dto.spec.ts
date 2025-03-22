import { validate } from 'class-validator';
import {
  SummaryIdDto,
  RateSummaryDto,
  SummaryActionDto,
  SummaryActionLanguageCodeDto,
} from '../summary.dto';

describe('DTO Validation', () => {
  it('should pass validation for valid SummaryIdDto', async () => {
    const dto = new SummaryIdDto();
    dto.summaryId = 1;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation for invalid SummaryIdDto (non-integer)', async () => {
    const dto = new SummaryIdDto();
    dto.summaryId = 'invalid' as unknown as number;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isInt');
  });

  it('should pass validation for valid RateSummaryDto', async () => {
    const dto = new RateSummaryDto();
    dto.userId = '123e4567-e33b-12d3-a456-426614174000';
    dto.summaryId = 1;
    dto.rating = 5;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation for invalid rating (below 1)', async () => {
    const dto = new RateSummaryDto();
    dto.userId = '123e4567-e33b-12d3-a456-426614174000';
    dto.summaryId = 1;
    dto.rating = 0;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('min');
  });

  it('should fail validation for invalid rating (above 5)', async () => {
    const dto = new RateSummaryDto();
    dto.userId = '123e4567-e33b-12d3-a456-426614174000';
    dto.summaryId = 1;
    dto.rating = 6;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('max');
  });

  it('should fail validation for non-UUID userId in RateSummaryDto', async () => {
    const dto = new RateSummaryDto();
    dto.userId = 'invalid-uuid';
    dto.summaryId = 1;
    dto.rating = 5;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });

  it('should pass validation for valid SummaryActionDto', async () => {
    const dto = new SummaryActionDto();
    dto.userId = '123e4567-e43b-12d3-a456-426614174000';
    dto.summaryId = 1;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation for non-UUID userId in SummaryActionDto', async () => {
    const dto = new SummaryActionDto();
    dto.userId = 'invalid-uuid';
    dto.summaryId = 1;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });

  it('should pass validation for valid SummaryActionLanguageCodeDto', async () => {
    const dto = new SummaryActionLanguageCodeDto();
    dto.userId = '123e4567-e43b-12d3-a456-426614174000';
    dto.summaryId = 1;
    dto.languageCode = 'en';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation for non-string languageCode in SummaryActionLanguageCodeDto', async () => {
    const dto = new SummaryActionLanguageCodeDto();
    dto.userId = '123e4567-e43b-12d3-a456-426614174000';
    dto.summaryId = 1;
    dto.languageCode = 123 as unknown as string;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isString');
  });
});
