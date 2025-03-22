import { Controller, Get, Param, ParseArrayPipe } from '@nestjs/common';
import { MindsService } from './minds.service';
import { UserIdDto } from '../common/dto/params/user.dto';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { BooleansDto, CountDto } from '../common/dto/responses/general.dto';
import { MindDto } from '../common/dto/responses/mind.dto';

@Controller('minds')
export class MindsController {
  constructor(private readonly mindsService: MindsService) {}

  @Get('are-saved/:mindIds/:userId')
  @ApiOperation({ summary: 'Check if minds are saved' })
  @ApiParam({ name: 'mindIds', type: 'string', required: true })
  @ApiParam({ name: 'userId', type: 'string', required: true })
  @ApiResponse({ status: 200, type: BooleansDto })
  async areMindsSaved(
    @Param('mindIds', new ParseArrayPipe({ items: Number, separator: ',' }))
    mindIds: number[],
    @Param() params: UserIdDto,
  ): Promise<BooleansDto> {
    return this.mindsService.areMindsSaved(mindIds, params.userId);
  }

  @Get('are-liked/:mindIds/:userId')
  @ApiOperation({ summary: 'Check if minds are liked' })
  @ApiParam({ name: 'mindIds', type: 'string', required: true })
  @ApiParam({ name: 'userId', type: 'string', required: true })
  @ApiResponse({ status: 200, type: BooleansDto })
  async areMindsLiked(
    @Param('mindIds', new ParseArrayPipe({ items: Number, separator: ',' }))
    mindIds: number[],
    @Param() params: UserIdDto,
  ): Promise<BooleansDto> {
    return this.mindsService.areMindsLiked(mindIds, params.userId);
  }

  @Get('saved-count/:userId')
  @ApiOperation({ summary: 'Get saved minds count' })
  @ApiParam({ name: 'userId', type: 'string', required: true })
  @ApiResponse({ status: 200, type: CountDto })
  async getSavedMindsCount(@Param() params: UserIdDto): Promise<CountDto> {
    return this.mindsService.getSavedMindsCount(params.userId);
  }

  @Get('saved/:userId')
  @ApiOperation({ summary: 'Get saved minds' })
  @ApiParam({ name: 'userId', type: 'string', required: true })
  @ApiResponse({ status: 200, type: MindDto, isArray: true })
  async getSavedMinds(@Param() params: UserIdDto): Promise<MindDto[]> {
    return this.mindsService.getSavedMinds(params.userId);
  }
}
