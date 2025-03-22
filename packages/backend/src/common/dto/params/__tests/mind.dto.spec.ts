import { validate } from 'class-validator';
import { MindUserDto, MindIdDto } from '../mind.dto';

describe('DTO Validation', () => {
  describe('MindUserDto', () => {
    it('should validate successfully with valid mindId and userId', async () => {
      const dto = new MindUserDto();
      dto.mindId = 1;
      dto.userId = '123e4567-e33b-12d3-a456-426614174000';

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation if mindId is not an integer', async () => {
      const dto = new MindUserDto();
      dto.mindId = 'not-an-integer' as unknown as number;
      dto.userId = '123e4567-e3b-12d3-a456-426614174000';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isInt');
    });

    it('should fail validation if userId is not a valid UUID', async () => {
      const dto = new MindUserDto();
      dto.mindId = 1;
      dto.userId = 'invalid-uuid';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isUuid');
    });

    it('should fail validation if mindId is missing', async () => {
      const dto = new MindUserDto();
      dto.userId = '123e4567-e3b-12d3-a456-426614174000';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isInt');
    });

    it('should fail validation if userId is missing', async () => {
      const dto = new MindUserDto();
      dto.mindId = 1;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isUuid');
    });
  });

  describe('MindIdDto', () => {
    it('should validate successfully with a valid mindId', async () => {
      const dto = new MindIdDto();
      dto.mindId = 1;

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation if mindId is not an integer', async () => {
      const dto = new MindIdDto();
      dto.mindId = 'not-an-integer' as unknown as number;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isInt');
    });

    it('should fail validation if mindId is missing', async () => {
      const dto = new MindIdDto();

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isInt');
    });
  });
});
