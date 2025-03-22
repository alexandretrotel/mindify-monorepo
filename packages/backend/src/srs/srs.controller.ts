import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SrsService } from './srs.service';
import {
  UpdateSrsDataDto,
  PostUserLearningSessionDto,
} from '../common/dto/params/srs.dto';
import { UserIdDto } from '../common/dto/params/user.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CardDto } from '../common/dto/responses/srs.dto';
import { ActionDto } from '../common/dto/responses/general.dto';

@Controller('srs')
export class SrsController {
  constructor(private readonly srsService: SrsService) {}

  @Post('update')
  @ApiOperation({ summary: 'Update SRS data' })
  @ApiBody({ type: UpdateSrsDataDto, required: true })
  @ApiResponse({
    status: 200,
    description: 'The SRS data has been successfully updated.',
    type: CardDto,
  })
  async updateSrsData(
    @Body() updateSrsDataDto: UpdateSrsDataDto,
  ): Promise<CardDto> {
    return this.srsService.updateSrsData(
      updateSrsDataDto.mindId,
      updateSrsDataDto.userId,
      updateSrsDataDto.grade,
    );
  }

  @Post('session')
  @ApiOperation({ summary: 'Post user learning session' })
  @ApiBody({ type: PostUserLearningSessionDto, required: true })
  @ApiResponse({
    status: 200,
    description: 'The user learning session has been successfully posted.',
    type: ActionDto,
  })
  async postUserLearningSession(
    @Body() postUserLearningSessionDto: PostUserLearningSessionDto,
  ): Promise<ActionDto> {
    return this.srsService.postUserLearningSession(
      postUserLearningSessionDto.totalTimeInMs,
      postUserLearningSessionDto.totalLength,
      postUserLearningSessionDto.userId,
    );
  }

  @Get('srs-data/:userId')
  @ApiOperation({ summary: 'Get SRS data' })
  @ApiParam({ name: 'userId', type: 'string', required: true })
  // TODO: Add response type
  async getSrsData(@Param() userIdDto: UserIdDto) {
    return this.srsService.getSrsData(userIdDto.userId);
  }
}
