import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpdatePasswordDto } from '../common/dto/params/auth.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ActionDto } from '../common/dto/responses/general.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('update-password')
  @ApiOperation({ summary: 'Update the user password' })
  @ApiBody({ type: UpdatePasswordDto, required: true })
  @ApiResponse({ status: 200, type: ActionDto })
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<ActionDto> {
    if (updatePasswordDto.newPassword !== updatePasswordDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    return this.authService.updatePassword(updatePasswordDto.newPassword);
  }
}
