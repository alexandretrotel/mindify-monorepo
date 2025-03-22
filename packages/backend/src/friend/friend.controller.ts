import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendRequestDto } from '../common/dto/params/friend.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ActionDto } from '../common/dto/responses/general.dto';
import { FriendStatusDto } from '../common/dto/responses/friend.dto';

@Controller('friend')
export class FriendController {
  constructor(private readonly friendsService: FriendService) {}

  @Post('ask')
  @ApiOperation({ summary: 'Ask for friend' })
  @ApiBody({ type: FriendRequestDto, required: true })
  @ApiResponse({
    status: 200,
    description: 'The friend request has been successfully sent.',
    type: ActionDto,
  })
  async askForFriend(
    @Body() friendRequestDto: FriendRequestDto,
  ): Promise<ActionDto> {
    if (friendRequestDto.userId === friendRequestDto.profileId) {
      throw new BadRequestException(
        'It is not possible to be friend with yourself.',
      );
    }

    return this.friendsService.askForFriend(
      friendRequestDto.userId,
      friendRequestDto.profileId,
    );
  }

  @Delete('cancel/:userId/:profileId')
  @ApiOperation({ summary: 'Cancel friend request' })
  @ApiParam({ name: 'userId', type: 'string', required: true })
  @ApiParam({ name: 'profileId', type: 'string', required: true })
  @ApiResponse({
    status: 200,
    description: 'The friend request has been successfully canceled.',
    type: ActionDto,
  })
  async cancelFriendRequest(
    @Param() friendRequestDto: FriendRequestDto,
  ): Promise<ActionDto> {
    if (friendRequestDto.userId === friendRequestDto.profileId) {
      throw new BadRequestException(
        'It is not possible to be friend with yourself.',
      );
    }

    return this.friendsService.cancelFriendRequest(
      friendRequestDto.userId,
      friendRequestDto.profileId,
    );
  }

  @Post('accept')
  @ApiOperation({ summary: 'Accept friend request' })
  @ApiBody({ type: FriendRequestDto, required: true })
  @ApiResponse({
    status: 200,
    description: 'The friend request has been successfully accepted.',
    type: ActionDto,
  })
  async acceptFriendRequest(
    @Body() friendRequestDto: FriendRequestDto,
  ): Promise<ActionDto> {
    if (friendRequestDto.userId === friendRequestDto.profileId) {
      throw new BadRequestException(
        'It is not possible to be friend with yourself.',
      );
    }

    return this.friendsService.acceptFriendRequest(
      friendRequestDto.userId,
      friendRequestDto.profileId,
    );
  }

  @Delete('reject/:userId/:profileId')
  @ApiOperation({ summary: 'Reject friend request' })
  @ApiParam({ name: 'userId', type: 'string', required: true })
  @ApiParam({ name: 'profileId', type: 'string', required: true })
  @ApiResponse({
    status: 200,
    description: 'The friend request has been successfully rejected.',
    type: ActionDto,
  })
  async rejectFriendRequest(
    @Param() friendRequestDto: FriendRequestDto,
  ): Promise<ActionDto> {
    if (friendRequestDto.userId === friendRequestDto.profileId) {
      throw new BadRequestException(
        'It is not possible to be friend with yourself.',
      );
    }

    return this.friendsService.rejectFriendRequest(
      friendRequestDto.userId,
      friendRequestDto.profileId,
    );
  }

  @Delete('remove/:userId/:profileId')
  @ApiOperation({ summary: 'Remove friend request' })
  @ApiParam({ name: 'userId', type: 'string', required: true })
  @ApiParam({ name: 'profileId', type: 'string', required: true })
  @ApiResponse({
    status: 200,
    description: 'The friend has been successfully removed.',
    type: ActionDto,
  })
  async removeFriend(
    @Param() friendRequestDto: FriendRequestDto,
  ): Promise<ActionDto> {
    if (friendRequestDto.userId === friendRequestDto.profileId) {
      throw new BadRequestException(
        'It is not possible to be friend with yourself.',
      );
    }

    return this.friendsService.removeFriend(
      friendRequestDto.userId,
      friendRequestDto.profileId,
    );
  }

  @Get('status/:userId/:profileId')
  @ApiOperation({ summary: 'Get friend status' })
  @ApiParam({ name: 'userId', type: 'string', required: true })
  @ApiParam({ name: 'profileId', type: 'string', required: true })
  @ApiResponse({
    status: 200,
    description: 'The friend status has been successfully retrieved.',
    type: FriendStatusDto,
  })
  async getFriendStatus(
    @Param() params: FriendRequestDto,
  ): Promise<FriendStatusDto> {
    if (params.userId === params.profileId) {
      throw new BadRequestException(
        'It is not possible to be friend with yourself.',
      );
    }

    return this.friendsService.getFriendStatus(params.userId, params.profileId);
  }
}
