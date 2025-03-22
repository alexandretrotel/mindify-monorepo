import { Module } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardController } from './leaderboard.controller';
import { SupabaseModule } from '../common/supabase';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [SupabaseModule, UserModule],
  providers: [LeaderboardService],
  controllers: [LeaderboardController],
  exports: [LeaderboardService],
})
export class LeaderboardModule {}
