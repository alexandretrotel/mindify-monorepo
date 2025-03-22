import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../common/supabase';

@Injectable()
export class UsersService {
  constructor(private supabase: SupabaseService) {}

  async searchUsers(query: string) {
    const supabase = this.supabase.getClient();
    const { data: users, error } = await supabase.rpc('search_users', {
      search_query: query,
    });

    if (error) {
      console.error('Error searching users:', error);
      throw new InternalServerErrorException(
        'An error occurred while searching users.',
      );
    }

    return users;
  }
}
