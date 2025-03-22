import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserMetadata } from '@supabase/supabase-js';
import { SupabaseService } from '../common/supabase';

@Injectable()
export class UserService {
  constructor(private readonly supabase: SupabaseService) {}

  async getUserMetadata(userId: string) {
    const supabase = this.supabase.getClient();
    const { data, error } = await supabase
      .rpc('fetch_user_metadata', {
        user_id: userId,
      })
      .maybeSingle();

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while fetching the user metadata.',
      );
    }

    const metadata = data as UserMetadata;

    return { metadata };
  }

  async deleteUser(userId: string) {
    const supabase = this.supabase.getClient();
    const { error: deleteError } = await supabase.rpc('delete_user', {
      user_id: userId,
    });

    if (deleteError) {
      console.error(deleteError);
      throw new InternalServerErrorException(
        "An error occurred while deleting the user's account.",
      );
    }

    return { success: true, message: 'Account deleted successfully.' };
  }

  async getUserLevel(userId: string) {
    const supabase = this.supabase.getClient();
    const { data, error } = await supabase.rpc('get_user_level', {
      data: {
        user_id: userId,
      },
    });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while fetching the user level.',
      );
    }

    const { xp, level, xp_for_next_level, xp_of_current_level, progression } =
      data?.[0] ?? {
        xp: 0,
        level: 0,
        xp_for_next_level: 0,
        xp_of_current_level: 0,
        progression: 0,
      };

    return {
      xp,
      level,
      xp_for_next_level,
      xp_of_current_level,
      progression,
    };
  }

  async getUserFriends(userId: string) {
    const supabase = this.supabase.getClient();
    const { data: friends, error } = await supabase.rpc(
      'get_friends_metadata',
      {
        p_user_id: userId,
      },
    );

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while fetching the user friends.',
      );
    }

    return friends;
  }

  async getFriendIds(userId: string) {
    const supabase = this.supabase.getClient();
    const { data: userFriendsData, error: userFriendsError } = await supabase
      .from('friends')
      .select('friend_id')
      .eq('user_id', userId);

    if (userFriendsError) {
      console.error(userFriendsError);
      throw new InternalServerErrorException(
        "An error occurred while fetching the user's friends.",
      );
    }

    const {
      data: usersWhoAskedToBeFriendWithCurrentUserData,
      error: userWhoAskedToBeFriendWithCurrentUserError,
    } = await supabase
      .from('friends')
      .select('user_id')
      .eq('friend_id', userId);

    if (userWhoAskedToBeFriendWithCurrentUserError) {
      console.error(userWhoAskedToBeFriendWithCurrentUserError);
      throw new InternalServerErrorException(
        "An error occurred while fetching the user's friends.",
      );
    }

    const friendsIds = userFriendsData
      ?.flatMap((friend) => friend?.friend_id)
      ?.filter(
        (friendId) =>
          friendId !== userId &&
          usersWhoAskedToBeFriendWithCurrentUserData?.some(
            (friend) => friend?.user_id === friendId,
          ),
      );

    const askedFriendsIds = userFriendsData
      ?.flatMap((friend) => friend?.friend_id)
      ?.filter(
        (friendId) =>
          friendId !== userId &&
          !usersWhoAskedToBeFriendWithCurrentUserData?.some(
            (friend) => friend?.user_id === friendId,
          ),
      );

    const requestedFriendsIds = usersWhoAskedToBeFriendWithCurrentUserData
      ?.flatMap((friend) => friend?.user_id)
      ?.filter(
        (friendId) =>
          friendId !== userId &&
          !userFriendsData?.some((friend) => friend?.friend_id === friendId),
      );

    return { friendsIds, askedFriendsIds, requestedFriendsIds };
  }

  async getPendingFriendIds(userId: string) {
    const supabase = this.supabase.getClient();
    const { data: userFriendsData, error: userFriendsError } = await supabase
      .from('friends')
      .select('friend_id')
      .eq('user_id', userId);

    if (userFriendsError) {
      console.error(userFriendsError);
      throw new InternalServerErrorException(
        "An error occurred while fetching the user's friends.",
      );
    }

    const {
      data: usersWhoAskedToBeFriendWithCurrentUserData,
      error: userWhoAskedToBeFriendWithCurrentUserError,
    } = await supabase
      .from('friends')
      .select('user_id')
      .eq('friend_id', userId);

    if (userWhoAskedToBeFriendWithCurrentUserError) {
      console.error(userWhoAskedToBeFriendWithCurrentUserError);
      throw new InternalServerErrorException(
        "An error occurred while fetching the user's friends.",
      );
    }

    const pendingFriendsIds = userFriendsData
      ?.flatMap((friend) => friend?.friend_id)
      ?.filter(
        (friendId) =>
          friendId !== userId &&
          !usersWhoAskedToBeFriendWithCurrentUserData?.some(
            (friend) => friend?.user_id === friendId,
          ),
      );

    return { pendingFriendsIds };
  }

  async updateProfile(username: string, biography: string) {
    const supabase = this.supabase.getClient();
    const { error } = await supabase.auth.updateUser({
      data: {
        name: username,
        biography,
      },
    });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        "An error occurred while updating the user's profile.",
      );
    }

    return { success: true, message: 'Profile updated successfully.' };
  }
}
