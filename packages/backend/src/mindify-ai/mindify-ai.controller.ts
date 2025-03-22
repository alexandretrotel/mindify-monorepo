import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { MindifyAiService } from './mindify-ai.service';
import { DeleteAllMessagesDto } from '../common/dto/params/mindify-ai.dto';
import { UserIdDto } from '../common/dto/params/user.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import {
  ActionDto,
  CountDto,
  IdDto,
} from '../common/dto/responses/general.dto';
import { ChatDto } from '../common/dto/responses/mindify-ai.dto';

@Controller('mindify-ai')
export class MindifyAiController {
  constructor(private readonly mindifyAiService: MindifyAiService) {}

  @Delete('all-messages/:userId/:chatId')
  @ApiOperation({ summary: 'Delete all messages' })
  @ApiParam({ name: 'userId', type: 'string', required: true })
  @ApiParam({ name: 'chatId', type: 'number', required: true })
  @ApiResponse({
    status: 200,
    description: 'All messages have been successfully deleted.',
  })
  async deleteAllMessages(
    @Param() deleteAllMessagesDto: DeleteAllMessagesDto,
  ): Promise<ActionDto> {
    return this.mindifyAiService.deleteAllMessages(
      deleteAllMessagesDto.userId,
      deleteAllMessagesDto.chatId,
    );
  }

  @Get('chat-id/:userId')
  @ApiOperation({ summary: 'Fetch chat ID' })
  @ApiParam({ name: 'userId', type: 'string', required: true })
  @ApiResponse({
    status: 200,
    description: 'Chat ID',
    type: IdDto,
  })
  async fetchChatId(@Param() params: UserIdDto): Promise<IdDto> {
    return this.mindifyAiService.fetchChatId(params.userId);
  }

  @Post('chat')
  @ApiOperation({ summary: 'Create chat' })
  @ApiBody({ type: UserIdDto, required: true })
  async createChat(@Body() createChatDto: UserIdDto): Promise<ChatDto> {
    return this.mindifyAiService.createChat(createChatDto.userId);
  }

  @Get('today-prompts-count/:userId')
  @ApiOperation({ summary: 'Fetch user today prompts count' })
  @ApiParam({ name: 'userId', type: 'string', required: true })
  @ApiResponse({
    status: 200,
    description: 'User today prompts count',
    type: CountDto,
  })
  async getUserTodayPromptsCount(
    @Param() params: UserIdDto,
  ): Promise<CountDto> {
    return this.mindifyAiService.getUserTodayPromptsCount(params.userId);
  }
}
