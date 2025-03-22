import { validate } from 'class-validator';
import { SearchSummariesDto } from '../summaries.dto';

describe('SearchSummariesDto', () => {
  it('should pass validation with valid query and languageCode', async () => {
    const dto = new SearchSummariesDto();
    dto.query = 'lorem ipsum';
    dto.languageCode = 'en';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation if query is an empty string', async () => {
    const dto = new SearchSummariesDto();
    dto.query = '';
    dto.languageCode = 'en';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail validation if languageCode is an empty string', async () => {
    const dto = new SearchSummariesDto();
    dto.query = 'lorem ipsum';
    dto.languageCode = '';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail validation if query is not a string', async () => {
    const dto = new SearchSummariesDto();
    dto.query = 123 as unknown as string;
    dto.languageCode = 'en';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should fail validation if languageCode is not a string', async () => {
    const dto = new SearchSummariesDto();
    dto.query = 'lorem ipsum';
    dto.languageCode = 123 as unknown as string;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isString');
  });
});
