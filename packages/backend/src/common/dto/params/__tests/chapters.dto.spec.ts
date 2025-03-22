import { validate } from 'class-validator';
import { ChaptersIdDto } from '../chapters.dto';

describe('ChaptersIdDto', () => {
  it('should pass validation when chapterId is a valid integer', async () => {
    const dto = new ChaptersIdDto();
    dto.chapterId = 1;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation when chapterId is not a valid integer', async () => {
    const dto = new ChaptersIdDto();
    dto.chapterId = 'string' as any;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('chapterId');
  });
});
