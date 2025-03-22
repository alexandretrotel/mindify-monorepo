import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { MindService } from './mind.service';
import { MindUserDto, MindIdDto } from '../common/dto/params/mind.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import {
  ActionDto,
  BooleanDto,
  CountDto,
} from '../common/dto/responses/general.dto';

@Controller('mind')
export class MindController {
  constructor(private readonly mindService: MindService) {}

  @Post('save')
  @ApiOperation({ summary: 'Save mind' })
  @ApiBody({ type: MindUserDto })
  @ApiResponse({ status: 200, type: ActionDto })
  async saveMind(@Body() mindUserDto: MindUserDto): Promise<ActionDto> {
    return this.mindService.saveMind(mindUserDto.userId, mindUserDto.mindId);
  }

  @Delete('unsave/:mindId/:userId')
  @ApiOperation({ summary: 'Unsave mind' })
  @ApiParam({ name: 'mindId', type: 'number', required: true })
  @ApiParam({ name: 'userId', type: 'string', required: true })
  @ApiResponse({ status: 200, type: ActionDto })
  async unsaveMind(@Param() mindUserDto: MindUserDto): Promise<ActionDto> {
    return this.mindService.unsaveMind(mindUserDto.userId, mindUserDto.mindId);
  }

  @Post('like')
  @ApiOperation({ summary: 'Like mind' })
  @ApiBody({ type: MindUserDto })
  @ApiResponse({ status: 200, type: ActionDto })
  async likeMind(@Body() mindUserDto: MindUserDto): Promise<ActionDto> {
    return this.mindService.likeMind(mindUserDto.userId, mindUserDto.mindId);
  }

  @Delete('unlike/:mindId/:userId')
  @ApiOperation({ summary: 'Unlike mind' })
  @ApiParam({ name: 'mindId', type: 'number', required: true })
  @ApiParam({ name: 'userId', type: 'string', required: true })
  @ApiResponse({ status: 200, type: ActionDto })
  async unlikeMind(@Param() mindUserDto: MindUserDto): Promise<ActionDto> {
    return this.mindService.unlikeMind(mindUserDto.userId, mindUserDto.mindId);
  }

  @Get('is-saved/:mindId/:userId')
  @ApiOperation({ summary: 'Check if mind is saved' })
  @ApiParam({ name: 'mindId', type: 'number', required: true })
  @ApiParam({ name: 'userId', type: 'string', required: true })
  @ApiResponse({ status: 200, type: BooleanDto })
  async isMindSaved(@Param() params: MindUserDto): Promise<BooleanDto> {
    return this.mindService.isMindSaved(params.userId, params.mindId);
  }

  @Get('is-liked/:mindId/:userId')
  @ApiOperation({ summary: 'Check if mind is liked' })
  @ApiParam({ name: 'mindId', type: 'number', required: true })
  @ApiParam({ name: 'userId', type: 'string', required: true })
  @ApiResponse({ status: 200, type: BooleanDto })
  async isMindLiked(@Param() params: MindUserDto): Promise<BooleanDto> {
    return this.mindService.isMindLiked(params.userId, params.mindId);
  }

  @Get('save-count/:mindId')
  @ApiOperation({ summary: 'Get saved count' })
  @ApiParam({ name: 'mindId', type: 'number', required: true })
  @ApiResponse({ status: 200, type: CountDto })
  async getSavedMindCount(@Param() params: MindIdDto): Promise<CountDto> {
    return this.mindService.getSavedMindCount(params.mindId);
  }

  @Get('like-count/:mindId')
  @ApiOperation({ summary: 'Get liked count' })
  @ApiParam({ name: 'mindId', type: 'number', required: true })
  @ApiResponse({ status: 200, type: CountDto })
  async getLikedMindCount(@Param() params: MindIdDto): Promise<CountDto> {
    return this.mindService.getLikedMindCount(params.mindId);
  }
}
