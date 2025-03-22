import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  ActionDto,
  BooleanDto,
  BooleansDto,
  CountDto,
  IdDto,
  NameDto,
  TitleDto,
  TimestampDto,
  TimestampsDto,
} from '../general.dto';

describe('DTO Validation Tests', () => {
  it('should validate a valid ActionDto instance', async () => {
    const input = { success: true, message: 'Action completed successfully' };
    const dto = plainToInstance(ActionDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should return validation errors for invalid ActionDto input', async () => {
    const input = { success: 'not-a-boolean', message: 123 };
    const dto = plainToInstance(ActionDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should validate a valid BooleanDto instance', async () => {
    const input = { value: true };
    const dto = plainToInstance(BooleanDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate a valid BooleansDto instance', async () => {
    const input = { values: [true, false, true] };
    const dto = plainToInstance(BooleansDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate a valid CountDto instance', async () => {
    const input = { count: 5 };
    const dto = plainToInstance(CountDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate a valid IdDto instance', async () => {
    const input = { id: 1 };
    const dto = plainToInstance(IdDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate a valid NameDto instance', async () => {
    const input = { name: 'John Doe' };
    const dto = plainToInstance(NameDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate a valid TitleDto instance', async () => {
    const input = { title: 'The Title' };
    const dto = plainToInstance(TitleDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate a valid TimestampDto instance', async () => {
    const input = { timestamp: '2021-01-01T00:00:00.000Z' };
    const dto = plainToInstance(TimestampDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate a valid TimestampsDto instance', async () => {
    const input = {
      timestamps: ['2021-01-01T00:00:00.000Z', '2021-01-02T00:00:00.000Z'],
    };
    const dto = plainToInstance(TimestampsDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
