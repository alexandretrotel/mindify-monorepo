import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { SearchUsersDto } from '../common/dto/params/users.dto';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { SearchUserDto } from '../common/dto/responses/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('search/:query')
  @ApiOperation({ summary: 'Search users' })
  @ApiParam({ name: 'query', type: 'string', required: true })
  @ApiResponse({
    status: 200,
    type: [SearchUserDto],
  })
  async searchUsers(
    @Param() searchUsersDto: SearchUsersDto,
  ): Promise<SearchUserDto[]> {
    return this.usersService.searchUsers(searchUsersDto.query);
  }
}
