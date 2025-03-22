import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  SummaryDto,
  SummaryWithChaptersDto,
  SummaryRatingDto,
} from '../summary.dto';

describe('SummaryDto Validation Tests', () => {
  it('should validate a valid SummaryDto instance', async () => {
    const input = {
      id: 1,
      title: 'This is a summary title',
      image_url: 'https://example.com/image.jpg',
      source_type: 'book',
      source_url: 'https://example.com/source',
      reading_time: 10,
      created_at: '2021-09-01T00:00:00.000Z',
      author_name: 'John Doe',
      author_description: 'This is a summary author description',
      topic_name: 'Productivity',
    };
    const dto = plainToInstance(SummaryDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should return validation errors for invalid SummaryDto input', async () => {
    const input = {
      id: 'invalid',
      title: '',
      image_url: 12345,
      source_type: 'invalid_source',
      source_url: null,
      reading_time: 'invalid',
      created_at: 'not-a-date',
      author_name: '',
      author_description: null,
      topic_name: null,
    };
    const dto = plainToInstance(SummaryDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('SummaryWithChaptersDto Validation Tests', () => {
  it('should validate a valid SummaryWithChaptersDto instance', async () => {
    const input = {
      id: 1,
      title: 'This is a summary title',
      image_url: 'https://example.com/image.jpg',
      source_type: 'book',
      source_url: 'https://example.com/source',
      reading_time: 10,
      created_at: '2021-09-01T00:00:00.000Z',
      author_name: 'John Doe',
      author_description: 'This is a summary author description',
      topic_name: 'Productivity',
      chapters: {
        chapters: {
          1: 'Chapter 1',
        },
      },
    };
    const dto = plainToInstance(SummaryWithChaptersDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should return validation errors for missing or invalid chapters in SummaryWithChaptersDto', async () => {
    const input = {
      id: 1,
      title: 'This is a summary title',
      image_url: 'https://example.com/image.jpg',
      source_type: 'book',
      source_url: 'https://example.com/source',
      reading_time: 10,
      created_at: '2021-09-01T00:00:00.000Z',
      author_name: 'John Doe',
      author_description: 'This is a summary author description',
      topic_name: 'Productivity',
    };
    const dto = plainToInstance(SummaryWithChaptersDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('SummaryRatingDto Validation Tests', () => {
  it('should validate a valid SummaryRatingDto instance', async () => {
    const input = {
      rating: 4.5,
    };
    const dto = plainToInstance(SummaryRatingDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should return validation errors for invalid SummaryRatingDto input', async () => {
    const input = {
      rating: 'invalid',
    };
    const dto = plainToInstance(SummaryRatingDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
