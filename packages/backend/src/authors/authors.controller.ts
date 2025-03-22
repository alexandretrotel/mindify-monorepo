import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import {
  LanguageCodeDto,
  LanguageCodeIdsDto,
} from '../common/dto/params/translation.dto';
import { AuthorDto } from '../common/dto/responses/author.dto';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Get('/:languageCode')
  @ApiOperation({ summary: 'Get authors' })
  @ApiParam({
    name: 'languageCode',
    required: true,
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'The authors have been successfully retrieved.',
    type: [AuthorDto],
  })
  async getAuthors(
    @Param() languageCodeDto: LanguageCodeDto,
  ): Promise<AuthorDto[]> {
    return this.authorsService.getAuthors(languageCodeDto.languageCode);
  }

  @Post('/ids')
  @ApiOperation({ summary: 'Get authors from ids' })
  @ApiBody({
    type: LanguageCodeIdsDto,
    required: true,
    description: 'The IDs and language code',
  })
  @ApiResponse({
    status: 200,
    description: 'The authors have been successfully retrieved.',
    type: [AuthorDto],
  })
  async getAuthorsFromIds(
    @Body() languageCodeIdsDto: LanguageCodeIdsDto,
  ): Promise<AuthorDto[]> {
    return this.authorsService.getAuthorsFromIds(
      languageCodeIdsDto.ids,
      languageCodeIdsDto.languageCode,
    );
  }
}
