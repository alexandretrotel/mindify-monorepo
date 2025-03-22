import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../common/supabase';
import { UserService } from 'src/user/user.service';

@Injectable()
export class LeaderboardService {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly user: UserService,
  ) {}

  async getGlobalLeaderboard() {
    const supabase = this.supabase.getClient();
    const { data, error } = await supabase
      .from('leaderboard')
      .select('user_id, xp')
      .order('xp', { ascending: false });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while fetching the global leaderboard.',
      );
    }

    const leaderboard = data;
    const length = leaderboard?.length ?? 0;

    return {
      length,
      leaderboard,
    };
  }

  async getFriendsLeaderboard(userId: string) {
    const { friendsIds } = await this.user.getFriendIds(userId);

    const friendsIdsAndUserId = friendsIds.concat([userId]);

    const supabase = this.supabase.getClient();
    const { data: leaderboardData, error: leaderboardError } = await supabase
      .from('leaderboard')
      .select('user_id, xp')
      .in('user_id', friendsIdsAndUserId)
      .order('xp', { ascending: false });

    if (leaderboardError) {
      console.error(leaderboardError);
      throw new InternalServerErrorException(
        'An error occurred while fetching the friends leaderboard.',
      );
    }

    const leaderboard = leaderboardData;
    const length = leaderboard?.length ?? 0;

    return {
      length,
      leaderboard,
    };
  }
}
