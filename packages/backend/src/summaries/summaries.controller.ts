import { Body, Controller, Get, Post, Param, Query } from '@nestjs/common';
import { SummariesService } from './summaries.service';
import { SearchSummariesDto } from '../common/dto/params/summaries.dto';
import { TopicIdLanguageDto } from '../common/dto/params/topic.dto';
import { UserIdDto } from '../common/dto/params/user.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import {
  LanguageCodeDto,
  LanguageCodeIdsDto,
} from '../common/dto/params/translation.dto';
import { SummaryDto } from '../common/dto/responses/summary.dto';
import { CountDto, TimestampsDto } from '../common/dto/responses/general.dto';

@Controller('summaries')
export class SummariesController {
  constructor(private readonly summariesService: SummariesService) {}

  @Get('/:languageCode')
  @ApiOperation({ summary: 'Get summaries' })
  @ApiParam({
    name: 'languageCode',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The summaries have been successfully fetched.',
    type: [SummaryDto],
  })
  async getSummaries(
    @Param() languageCodeDto: LanguageCodeDto,
  ): Promise<SummaryDto[]> {
    return this.summariesService.getSummaries(languageCodeDto.languageCode);
  }

  @Post('/ids')
  @ApiOperation({ summary: 'Get summaries by IDs' })
  @ApiBody({
    type: LanguageCodeIdsDto,
    required: true,
    description: 'The IDs and language code',
  })
  @ApiResponse({
    status: 200,
    description: 'The summaries have been successfully fetched.',
    type: [SummaryDto],
  })
  async getSummariesByIds(
    @Body() languageCodeIdsDto: LanguageCodeIdsDto,
  ): Promise<SummaryDto[]> {
    return this.summariesService.getSummariesByIds(
      languageCodeIdsDto.ids,
      languageCodeIdsDto.languageCode,
    );
  }

  @Get('search/:query/:languageCode')
  @ApiOperation({ summary: 'Search summaries' })
  @ApiParam({
    name: 'query',
    type: String,
    required: true,
  })
  @ApiParam({
    name: 'languageCode',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The summaries have been successfully fetched.',
    type: [SummaryDto],
  })
  async searchSummaries(
    @Query() { query, languageCode }: SearchSummariesDto,
  ): Promise<SummaryDto[]> {
    return this.summariesService.searchSummaries(query, languageCode);
  }

  @Get(':topicId/:languageCode')
  @ApiOperation({ summary: 'Get summaries by topic' })
  @ApiParam({
    name: 'topicId',
    type: String,
    required: true,
  })
  @ApiParam({
    name: 'languageCode',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The summaries have been successfully fetched.',
    type: [SummaryDto],
  })
  async getSummariesByTopicId(
    @Param() topicIdLanguageDto: TopicIdLanguageDto,
  ): Promise<SummaryDto[]> {
    return this.summariesService.getSummariesByTopicId(
      topicIdLanguageDto.topicId,
      topicIdLanguageDto.languageCode,
    );
  }

  @Get('best-rated/:languageCode')
  @ApiOperation({ summary: 'Get best rated summaries' })
  @ApiParam({
    name: 'languageCode',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The summaries have been successfully fetched.',
    type: [SummaryDto],
  })
  async getBestRatedSummaries(
    @Param() languageCodeDto: LanguageCodeDto,
  ): Promise<SummaryDto[]> {
    return this.summariesService.getBestRatedSummaries(
      languageCodeDto.languageCode,
    );
  }

  @Get('read/:userId')
  @ApiOperation({ summary: 'Get read summaries' })
  @ApiParam({
    name: 'userId',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The summaries have been successfully fetched.',
    type: [SummaryDto],
  })
  async getReadSummaries(@Param() UserIdDto: UserIdDto): Promise<SummaryDto[]> {
    return this.summariesService.getReadSummaries(UserIdDto.userId);
  }

  @Get('saved/:userId')
  @ApiOperation({ summary: 'Get saved summaries' })
  @ApiParam({
    name: 'userId',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The summaries have been successfully fetched.',
    type: [SummaryDto],
  })
  async getSavedSummaries(
    @Param() UserIdDto: UserIdDto,
  ): Promise<SummaryDto[]> {
    return this.summariesService.getSavedSummaries(UserIdDto.userId);
  }

  @Get('read-timestamps/:userId')
  @ApiOperation({ summary: 'Get read summaries timestamps' })
  @ApiParam({
    name: 'userId',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The timestamps have been successfully fetched.',
    type: TimestampsDto,
  })
  async getReadSummariesTimestamps(
    @Param() UserIdDto: UserIdDto,
  ): Promise<TimestampsDto> {
    return this.summariesService.getReadSummariesTimestamps(UserIdDto.userId);
  }

  @Get('read-count/:userId')
  @ApiOperation({ summary: 'Get read summaries count' })
  @ApiParam({
    name: 'userId',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The count has been successfully fetched.',
    type: CountDto,
  })
  async getReadSummariesCount(
    @Param() UserIdDto: UserIdDto,
  ): Promise<CountDto> {
    return this.summariesService.getReadSummariesCount(UserIdDto.userId);
  }
}
