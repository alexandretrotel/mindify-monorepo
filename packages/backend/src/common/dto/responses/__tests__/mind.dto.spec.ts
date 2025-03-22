import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { MindDto } from '../mind.dto';

describe('MindDto Validation Tests', () => {
  it('should validate a valid MindDto instance', async () => {
    const input = {
      id: 1,
      text: 'This is a mind text',
      question: 'This is a mind question',
      summary_title: 'This is a mind summary title',
      author_name: 'Author Name',
      topic_name: 'Topic Name',
      created_at: '2021-09-01T00:00:00.000Z',
    };
    const dto = plainToInstance(MindDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should return validation errors for invalid MindDto input', async () => {
    const input = {
      id: 'invalid-id',
      text: 12345,
      question: true,
      summary_title: 6789,
      author_name: false,
      topic_name: [],
      created_at: 'invalid-date',
    };
    const dto = plainToInstance(MindDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should validate a MindDto instance with optional fields missing', async () => {
    const input = {
      id: 1,
      text: 'This is a mind text',
      question: 'This is a mind question',
      created_at: '2021-09-01T00:00:00.000Z',
    };
    const dto = plainToInstance(MindDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should return validation errors for missing required fields in MindDto', async () => {
    const input = {
      summary_title: 'This is a mind summary title',
      author_name: 'Author Name',
      topic_name: 'Topic Name',
      created_at: '2021-09-01T00:00:00.000Z',
    };
    const dto = plainToInstance(MindDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
