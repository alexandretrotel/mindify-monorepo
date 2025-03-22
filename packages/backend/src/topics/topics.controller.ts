import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { UserIdDto } from '../common/dto/params/user.dto';
import { UpdateUserTopicsDto } from '../common/dto/params/topics.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import {
  LanguageCodeDto,
  LanguageCodeIdsDto,
  LanguageCodeUserIdDto,
} from '../common/dto/params/translation.dto';
import {
  ActionDto,
  CountDto,
  NameDto,
} from '../common/dto/responses/general.dto';
import {
  TopicProgressionDto,
  TopicSummaryCount,
} from '../common/dto/responses/topic.dto';

@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Get('/:languageCode')
  @ApiOperation({ summary: 'Get all topics' })
  @ApiParam({ name: 'languageCode', type: 'string', required: true })
  @ApiResponse({
    status: 200,
    type: NameDto,
    isArray: true,
  })
  async getTopics(
    @Param() languageCodeDto: LanguageCodeDto,
  ): Promise<NameDto[]> {
    return this.topicsService.getTopics(languageCodeDto.languageCode);
  }

  @Post('ids')
  @ApiOperation({ summary: 'Get topics by ids' })
  @ApiBody({
    type: LanguageCodeIdsDto,
    required: true,
    description: 'The IDs and language code',
  })
  @ApiResponse({
    status: 200,
    type: NameDto,
    isArray: true,
  })
  async getTopicsByIds(
    @Body() languageCodeIdsDto: LanguageCodeIdsDto,
  ): Promise<NameDto[]> {
    return this.topicsService.getTopicsByIds(
      languageCodeIdsDto.ids,
      languageCodeIdsDto.languageCode,
    );
  }

  @Get(':userId/:languageCode')
  @ApiOperation({ summary: 'Get topics by user id' })
  @ApiParam({ name: 'userId', type: 'string', required: true })
  @ApiParam({ name: 'languageCode', type: 'string', required: true })
  @ApiResponse({
    status: 200,
    type: NameDto,
    isArray: true,
  })
  async getTopicsByUserId(
    @Param() languageCodeUserIdDto: LanguageCodeUserIdDto,
  ): Promise<NameDto[]> {
    return this.topicsService.getTopicsByUserId(
      languageCodeUserIdDto.userId,
      languageCodeUserIdDto.languageCode,
    );
  }

  @Get('count/:userId')
  @ApiOperation({ summary: 'Get topics count by user id' })
  @ApiParam({ name: 'userId', type: 'string', required: true })
  @ApiResponse({
    status: 200,
    type: CountDto,
  })
  async getTopicsCountByUserId(
    @Param() userIdDto: UserIdDto,
  ): Promise<CountDto> {
    return this.topicsService.getTopicsCountByUserId(userIdDto.userId);
  }

  @Post('update/:userId')
  @ApiOperation({ summary: 'Update user topics' })
  @ApiBody({ type: UpdateUserTopicsDto, required: true })
  @ApiResponse({
    status: 200,
    type: ActionDto,
  })
  async updateUserTopics(
    @Body() UpdateUserTopicsDto: UpdateUserTopicsDto,
  ): Promise<ActionDto> {
    return this.topicsService.updateUserTopics(
      UpdateUserTopicsDto.userId,
      UpdateUserTopicsDto.selectedTopics,
    );
  }

  @Get('progression/:userId')
  @ApiOperation({ summary: 'Get user topics progression' })
  @ApiParam({ name: 'userId', type: 'string', required: true })
  @ApiResponse({
    status: 200,
    type: TopicProgressionDto,
    isArray: true,
  })
  async getUserTopicsProgression(
    @Param() userIdDto: UserIdDto,
  ): Promise<TopicProgressionDto[]> {
    return this.topicsService.getUserTopicsProgression(userIdDto.userId);
  }

  @Get('summaries-count')
  @ApiOperation({ summary: 'Get summaries count by topic' })
  @ApiResponse({
    status: 200,
    type: TopicSummaryCount,
    isArray: true,
  })
  async getSummariesCountByTopic(): Promise<TopicSummaryCount[]> {
    return this.topicsService.getSummariesCountByTopic();
  }
}
