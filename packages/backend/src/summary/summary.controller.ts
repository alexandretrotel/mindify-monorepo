import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SummaryService } from './summary.service';
import {
  RateSummaryDto,
  SummaryActionDto,
  SummaryActionLanguageCodeDto,
  SummaryIdDto,
} from '../common/dto/params/summary.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { LanguageCodeIdDto } from '../common/dto/params/translation.dto';
import {
  ActionDto,
  BooleanDto,
  CountDto,
  TitleDto,
} from '../common/dto/responses/general.dto';
import {
  SummaryDto,
  SummaryRatingDto,
  SummaryWithChaptersDto,
} from '../common/dto/responses/summary.dto';

@Controller('summary')
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Get('saved-count/:summaryId')
  @ApiOperation({ summary: 'Get saved count' })
  @ApiParam({
    name: 'summaryId',
    type: Number,
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: CountDto,
  })
  async getSummarySavedCount(
    @Param() summaryIdDto: SummaryIdDto,
  ): Promise<CountDto> {
    return this.summaryService.getSummarySavedCount(summaryIdDto.summaryId);
  }

  @Get('read-count/:summaryId')
  @ApiOperation({ summary: 'Get read count' })
  @ApiParam({
    name: 'summaryId',
    type: Number,
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: CountDto,
  })
  async getSummaryReadCount(
    @Param() summaryIdDto: SummaryIdDto,
  ): Promise<CountDto> {
    return this.summaryService.getSummaryReadCount(summaryIdDto.summaryId);
  }

  @Get('rating/:summaryId')
  @ApiOperation({ summary: 'Get rating' })
  @ApiParam({
    name: 'summaryId',
    type: Number,
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: SummaryRatingDto,
  })
  async getSummaryRating(
    @Param() summaryIdDto: SummaryIdDto,
  ): Promise<SummaryRatingDto> {
    return this.summaryService.getSummaryRating(summaryIdDto.summaryId);
  }

  @Get(':id/:languageCode')
  @ApiOperation({ summary: 'Get summary' })
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
    type: SummaryDto,
  })
  async getSummary(
    @Param() languageCodeIdDto: LanguageCodeIdDto,
  ): Promise<SummaryWithChaptersDto> {
    return this.summaryService.getSummary(
      languageCodeIdDto.id,
      languageCodeIdDto.languageCode,
    );
  }

  @Post('rate')
  @ApiOperation({ summary: 'Rate summary' })
  @ApiBody({
    type: RateSummaryDto,
    required: true,
    description: 'The user ID, the summary ID and the rating',
  })
  @ApiResponse({
    status: 200,
    type: ActionDto,
  })
  async rateSummary(
    @Body() rateSummaryDto: RateSummaryDto,
  ): Promise<ActionDto> {
    const { userId, summaryId, rating } = rateSummaryDto;
    return this.summaryService.rateSummary(userId, summaryId, rating);
  }

  @Post('save/:languageCode')
  @ApiOperation({ summary: 'Save summary' })
  @ApiBody({
    type: SummaryActionDto,
    required: true,
    description: 'The user ID and the summary ID',
  })
  @ApiResponse({
    status: 200,
    type: ActionDto,
  })
  async saveSummary(
    @Body() summaryActionLanguageCodeDto: SummaryActionLanguageCodeDto,
  ): Promise<ActionDto> {
    const { userId, summaryId, languageCode } = summaryActionLanguageCodeDto;
    return this.summaryService.saveSummary(userId, summaryId, languageCode);
  }

  @Delete('unsave')
  @ApiOperation({ summary: 'Unsave summary' })
  @ApiBody({
    type: SummaryActionDto,
    required: true,
    description: 'The user ID and the summary ID',
  })
  @ApiResponse({
    status: 200,
    type: ActionDto,
  })
  async unsaveSummary(
    @Body() summaryActionDto: SummaryActionDto,
  ): Promise<ActionDto> {
    const { userId, summaryId } = summaryActionDto;
    return this.summaryService.unsaveSummary(userId, summaryId);
  }

  @Post('mark-as-read')
  @ApiOperation({ summary: 'Mark summary as read' })
  @ApiBody({
    type: SummaryActionDto,
    required: true,
    description: 'The user ID and the summary ID',
  })
  @ApiResponse({
    status: 200,
    type: ActionDto,
  })
  async markSummaryAsRead(
    @Body() summaryActionLanguageCodeDto: SummaryActionLanguageCodeDto,
  ): Promise<ActionDto> {
    const { userId, summaryId, languageCode } = summaryActionLanguageCodeDto;
    return this.summaryService.markSummaryAsRead(
      userId,
      summaryId,
      languageCode,
    );
  }

  @Post('mark-as-unread')
  @ApiOperation({ summary: 'Mark summary as unread' })
  @ApiBody({
    type: SummaryActionDto,
    required: true,
    description: 'The user ID and the summary ID',
  })
  @ApiResponse({
    status: 200,
    type: ActionDto,
  })
  async markSummaryAsUnread(
    @Body() summaryActionDto: SummaryActionDto,
  ): Promise<ActionDto> {
    const { userId, summaryId } = summaryActionDto;
    return this.summaryService.markSummaryAsUnread(userId, summaryId);
  }

  @Get('is-saved/:userId/:summaryId')
  @ApiOperation({ summary: 'Check if summary is saved' })
  @ApiParam({
    name: 'userId',
    type: String,
    required: true,
  })
  @ApiParam({
    name: 'summaryId',
    type: Number,
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: BooleanDto,
  })
  async isSummarySaved(
    @Param() summaryActionDto: SummaryActionDto,
  ): Promise<BooleanDto> {
    return this.summaryService.isSummarySaved(
      summaryActionDto.userId,
      summaryActionDto.summaryId,
    );
  }

  @Get('is-read/:userId/:summaryId')
  @ApiOperation({ summary: 'Check if summary is read' })
  @ApiParam({
    name: 'userId',
    type: String,
    required: true,
  })
  @ApiParam({
    name: 'summaryId',
    type: Number,
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: BooleanDto,
  })
  async isSummaryRead(
    @Param() summaryActionDto: SummaryActionDto,
  ): Promise<BooleanDto> {
    return this.summaryService.isSummaryRead(
      summaryActionDto.userId,
      summaryActionDto.summaryId,
    );
  }

  @Get('rating/:userId/:summaryId')
  @ApiOperation({ summary: 'Get user summary rating' })
  @ApiParam({
    name: 'userId',
    type: String,
    required: true,
  })
  @ApiParam({
    name: 'summaryId',
    type: Number,
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: SummaryRatingDto,
  })
  async getUserSummaryRating(
    @Param() summaryActionDto: SummaryActionDto,
  ): Promise<SummaryRatingDto> {
    return this.summaryService.getUserSummaryRating(
      summaryActionDto.userId,
      summaryActionDto.summaryId,
    );
  }

  @Get('title/:summaryId/:languageCode')
  @ApiOperation({ summary: 'Get summary title' })
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
    type: TitleDto,
  })
  async getSummaryTitle(
    @Param() languageCodeIdDto: LanguageCodeIdDto,
  ): Promise<TitleDto> {
    return this.summaryService.getSummaryTitle(
      languageCodeIdDto.id,
      languageCodeIdDto.languageCode,
    );
  }
}
