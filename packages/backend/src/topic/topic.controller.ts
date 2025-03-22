import { Controller, Get, Param } from '@nestjs/common';
import { TopicService } from './topic.service';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { LanguageCodeIdDto } from '../common/dto/params/translation.dto';
import { NameDto } from '../common/dto/responses/general.dto';

@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Get('name/:topicId/:languageCode')
  @ApiOperation({ summary: 'Get the name of a topic' })
  @ApiParam({
    name: 'topicId',
    required: true,
    type: String,
  })
  @ApiParam({
    name: 'languageCode',
    required: true,
    type: String,
  })
  @ApiResponse({
    status: 200,
    type: NameDto,
  })
  async getTopicName(
    @Param() languageCodeIdDto: LanguageCodeIdDto,
  ): Promise<NameDto> {
    return this.topicService.getTopicName(
      languageCodeIdDto.id,
      languageCodeIdDto.languageCode,
    );
  }

  @Get('summary/:summaryId/:languageCode')
  @ApiOperation({ summary: 'Get the topic of a summary' })
  @ApiParam({
    name: 'summaryId',
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
    type: NameDto,
  })
  async getTopicFromSummaryId(
    @Param() languageCodeIdDto: LanguageCodeIdDto,
  ): Promise<NameDto> {
    return this.topicService.getTopicFromSummaryId(
      languageCodeIdDto.id,
      languageCodeIdDto.languageCode,
    );
  }
}
