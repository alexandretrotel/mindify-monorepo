import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AuthorDto } from '../author.dto';

describe('AuthorDto', () => {
  it('should validate a valid AuthorDto instance', async () => {
    const input = {
      name: 'John Doe',
      description: 'A great author',
    };

    const authorDto = plainToInstance(AuthorDto, input);
    const errors = await validate(authorDto);

    expect(errors.length).toBe(0);
  });

  it('should return validation errors for invalid input', async () => {
    const input = {
      name: 123,
      description: null,
    };

    const authorDto = plainToInstance(AuthorDto, input);
    const errors = await validate(authorDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          property: 'name',
          constraints: {
            isString: 'name must be a string',
          },
        }),
        expect.objectContaining({
          property: 'description',
          constraints: {
            isString: 'description must be a string',
          },
        }),
      ]),
    );
  });
});
