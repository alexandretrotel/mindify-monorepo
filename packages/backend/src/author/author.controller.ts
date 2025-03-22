import { Controller, Get, Param } from '@nestjs/common';
import { AuthorService } from './author.service';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { LanguageCodeIdDto } from '../common/dto/params/translation.dto';
import { AuthorDto } from '../common/dto/responses/author.dto';

@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Get(':id/:languageCode')
  @ApiOperation({ summary: 'Get author by ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiParam({
    name: 'languageCode',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: AuthorDto,
  })
  async getAuthorById(
    @Param() languageCodeIdDto: LanguageCodeIdDto,
  ): Promise<AuthorDto> {
    return this.authorService.getAuthorById(
      languageCodeIdDto.id,
      languageCodeIdDto.languageCode,
    );
  }

  @Get('summary/:summaryId/:languageCode')
  @ApiOperation({ summary: 'Get author by summary ID' })
  @ApiParam({
    name: 'summaryId',
    type: Number,
    required: true,
  })
  @ApiParam({
    name: 'languageCode',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: AuthorDto,
  })
  async getAuthorFromSummaryId(
    @Param() languageCodeIdDto: LanguageCodeIdDto,
  ): Promise<AuthorDto> {
    return this.authorService.getAuthorFromSummaryId(
      languageCodeIdDto.id,
      languageCodeIdDto.languageCode,
    );
  }
}
