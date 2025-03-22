import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ChaptersDto } from '../chapters.dto';

describe('ChaptersDto', () => {
  it('should validate a valid ChaptersDto instance', async () => {
    const input = {
      titles: ['Chapter 1', 'Chapter 2'],
      texts: ['Text 1', 'Text 2'],
    };

    const chaptersDto = plainToInstance(ChaptersDto, input);
    const errors = await validate(chaptersDto);

    expect(errors.length).toBe(0);
  });

  it('should return validation errors for invalid input', async () => {
    const input = {
      titles: 'Invalid Title',
      texts: [123, null],
    };

    const chaptersDto = plainToInstance(ChaptersDto, input);
    const errors = await validate(chaptersDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          property: 'titles',
          constraints: {
            isArray: 'titles must be an array',
          },
        }),
        expect.objectContaining({
          property: 'texts',
          constraints: {
            isString: 'each value in texts must be a string',
          },
        }),
      ]),
    );
  });
});
