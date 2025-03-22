import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { TopicProgressionDto, TopicSummaryCount } from '../topic.dto';

describe('TopicProgressionDto Validation Tests', () => {
  it('should validate a valid TopicProgressionDto instance', async () => {
    const input = {
      topicId: 1,
      count: 1,
      total: 1,
    };
    const dto = plainToInstance(TopicProgressionDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should return validation errors for invalid TopicProgressionDto input', async () => {
    const input = {
      topicId: 'invalid',
      count: 'invalid',
      total: 'invalid',
    };
    const dto = plainToInstance(TopicProgressionDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('TopicSummaryCount Validation Tests', () => {
  it('should validate a valid TopicSummaryCount instance', async () => {
    const input = {
      topicId: 1,
      count: 1,
    };
    const dto = plainToInstance(TopicSummaryCount, input);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should return validation errors for invalid TopicSummaryCount input', async () => {
    const input = {
      topicId: 'invalid',
      count: 'invalid',
    };
    const dto = plainToInstance(TopicSummaryCount, input);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
