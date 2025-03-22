import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateProfileDto, UserIdDto } from 'src/common//dto/params/user.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ActionDto } from '../common/dto/responses/general.dto';
import {
  UserFriendDto,
  UserFriendIdsDto,
  UserLevelDto,
  UserMetadataDto,
  UserPendingFriendsIdsDto,
} from '../common/dto/responses/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('metadata/:userId')
  @ApiOperation({ summary: 'Get user metadata' })
  @ApiParam({ name: 'userId', type: 'string', required: true })
  @ApiResponse({
    status: 200,
    type: UserMetadataDto,
  })
  async getUserMetadata(
    @Param() userIdDto: UserIdDto,
  ): Promise<UserMetadataDto> {
    return this.userService.getUserMetadata(userIdDto.userId);
  }

  @Delete(':userId')
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({ name: 'userId', type: 'string', required: true })
  @ApiResponse({
    status: 200,
    type: ActionDto,
  })
  deleteUser(@Param() userIdDto: UserIdDto): Promise<ActionDto> {
    return this.userService.deleteUser(userIdDto.userId);
  }

  @Get('level/:userId')
  @ApiOperation({ summary: 'Get user level' })
  @ApiParam({ name: 'userId', type: 'string', required: true })
  @ApiResponse({
    status: 200,
    type: UserLevelDto,
  })
  getUserLevel(@Param() userIdDto: UserIdDto): Promise<UserLevelDto> {
    return this.userService.getUserLevel(userIdDto.userId);
  }

  @Get('friends/:userId')
  @ApiOperation({ summary: 'Get user friends' })
  @ApiParam({ name: 'userId', type: 'string', required: true })
  @ApiResponse({
    status: 200,
    type: [UserFriendDto],
  })
  getUserFriends(@Param() userIdDto: UserIdDto): Promise<UserFriendDto[]> {
    return this.userService.getUserFriends(userIdDto.userId);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get user' })
  @ApiParam({ name: 'userId', type: 'string', required: true })
  @ApiResponse({
    status: 200,
    type: UserMetadataDto,
  })
  async getFriendIds(@Param() userIdDto: UserIdDto): Promise<UserFriendIdsDto> {
    return this.userService.getFriendIds(userIdDto.userId);
  }

  @Get('pending/:userId')
  @ApiOperation({ summary: 'Get pending friend ids' })
  @ApiParam({ name: 'userId', type: 'string', required: true })
  @ApiResponse({
    status: 200,
    type: UserPendingFriendsIdsDto,
  })
  async getPendingFriendIds(
    @Param() userIdDto: UserIdDto,
  ): Promise<UserPendingFriendsIdsDto> {
    return this.userService.getPendingFriendIds(userIdDto.userId);
  }

  @Post('update-profile/:userId')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiBody({ type: UpdateProfileDto, required: true })
  @ApiResponse({
    status: 200,
    type: ActionDto,
  })
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<ActionDto> {
    return this.userService.updateProfile(
      updateProfileDto.username,
      updateProfileDto.biography,
    );
  }
}
