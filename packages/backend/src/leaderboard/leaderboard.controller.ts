import { Controller, Get, Param } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { UserIdDto } from '../common/dto/params/user.dto';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { LeaderboardDto } from '../common/dto/responses/leaderboard.dto';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  @ApiOperation({ summary: 'Get global leaderboard' })
  @ApiResponse({ status: 200, type: LeaderboardDto })
  async getGlobalLeaderboard(): Promise<LeaderboardDto> {
    return this.leaderboardService.getGlobalLeaderboard();
  }

  @Get('friends/:userId')
  @ApiOperation({ summary: 'Get friends leaderboard' })
  @ApiParam({ name: 'userId', type: 'string', required: true })
  @ApiResponse({ status: 200, type: LeaderboardDto })
  async getFriendsLeaderboard(
    @Param() params: UserIdDto,
  ): Promise<LeaderboardDto> {
    return this.leaderboardService.getFriendsLeaderboard(params.userId);
  }
}
