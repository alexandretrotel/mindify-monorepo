import { Controller, Get, Param } from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ChaptersDto } from '../common/dto/responses/chapters.dto';
import { LanguageCodeIdDto } from '../common/dto/params/translation.dto';

@Controller('chapters')
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  @Get(':id/:languageCode')
  @ApiOperation({ summary: 'Get chapters by id' })
  @ApiParam({ name: 'chapterId', type: Number, required: true })
  @ApiResponse({
    status: 200,
    description: 'The chapters have been successfully retrieved.',
    type: ChaptersDto,
  })
  async getChaptersFromId(
    @Param() params: LanguageCodeIdDto,
  ): Promise<ChaptersDto> {
    return this.chaptersService.getChaptersFromId(
      params.id,
      params.languageCode,
    );
  }
}
