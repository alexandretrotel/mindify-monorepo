import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SupabaseService } from '../common/supabase';

@Module({
  providers: [AuthService, SupabaseService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
