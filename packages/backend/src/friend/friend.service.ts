import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseService } from '../common/supabase';
import { FriendStatus } from '../common/types/friends';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class FriendService {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly notification: NotificationService,
  ) {}

  async askForFriend(userId: string, profileId: string) {
    if (!userId || !profileId || userId === '' || profileId === '') {
      throw new BadRequestException('The user ID and profile ID are required.');
    }

    if (userId === profileId) {
      throw new BadRequestException(
        'It is not possible to be friend with yourself.',
      );
    }

    const supabase = this.supabase.getClient();

    const { error } = await supabase.from('friends').insert({
      user_id: userId,
      friend_id: profileId,
    });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while sending the friend request.',
      );
    }

    await this.notification.notifyFriendRequest(profileId, userId);

    return { success: true, message: 'Friend request sent successfully.' };
  }

  async cancelFriendRequest(userId: string, profileId: string) {
    if (!userId || !profileId || userId === '' || profileId === '') {
      throw new BadRequestException('The user ID and profile ID are required.');
    }

    if (userId === profileId) {
      throw new BadRequestException(
        'It is not possible to be friend with yourself.',
      );
    }

    const supabase = this.supabase.getClient();
    const { error } = await supabase
      .from('friends')
      .delete()
      .match({ user_id: userId, friend_id: profileId });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while canceling the friend request.',
      );
    }

    return { success: true, message: 'Friend request canceled successfully.' };
  }

  async acceptFriendRequest(userId: string, profileId: string) {
    if (!userId || !profileId || userId === '' || profileId === '') {
      throw new BadRequestException('The user ID and profile ID are required.');
    }

    if (userId === profileId) {
      throw new BadRequestException(
        'It is not possible to be friend with yourself.',
      );
    }

    const supabase = this.supabase.getClient();

    const { error } = await supabase.from('friends').upsert({
      user_id: userId,
      friend_id: profileId,
    });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while accepting the friend request.',
      );
    }

    await this.notification.notifyFriendRequestAccepted(profileId, userId);

    return { success: true, message: 'Friend request accepted successfully.' };
  }

  async rejectFriendRequest(userId: string, profileId: string) {
    if (!userId || !profileId || userId === '' || profileId === '') {
      throw new BadRequestException('The user ID and profile ID are required.');
    }

    if (userId === profileId) {
      throw new BadRequestException(
        'It is not possible to be friend with yourself.',
      );
    }

    const supabase = this.supabase.getClient();
    const { error: errorFirstDelete } = await supabase
      .from('friends')
      .delete()
      .match({ user_id: profileId, friend_id: userId });

    if (errorFirstDelete) {
      console.error(errorFirstDelete);
      throw new InternalServerErrorException(
        'An error occurred while rejecting the friend request.',
      );
    }

    const { error: errorSecondDelete } = await supabase
      .from('friends')
      .delete()
      .match({ user_id: userId, friend_id: profileId });

    if (errorSecondDelete) {
      console.error(errorSecondDelete);
      throw new InternalServerErrorException(
        'An error occurred while rejecting the friend request.',
      );
    }

    return { success: true, message: 'Friend request rejected successfully.' };
  }

  async removeFriend(userId: string, profileId: string) {
    if (!userId || !profileId || userId === '' || profileId === '') {
      throw new BadRequestException('The user ID and profile ID are required.');
    }

    if (userId === profileId) {
      throw new BadRequestException(
        'It is not possible to be friend with yourself.',
      );
    }

    const supabase = this.supabase.getClient();
    const { error: errorFirstDelete } = await supabase
      .from('friends')
      .delete()
      .match({ user_id: userId, friend_id: profileId });

    if (errorFirstDelete) {
      console.error(errorFirstDelete);
      throw new InternalServerErrorException(
        'An error occurred while removing the friend.',
      );
    }

    const { error: errorSecondDelete } = await supabase
      .from('friends')
      .delete()
      .match({ user_id: profileId, friend_id: userId });

    if (errorSecondDelete) {
      console.error(errorSecondDelete);
      throw new InternalServerErrorException(
        'An error occurred while removing the friend.',
      );
    }

    return { success: true, message: 'Friend removed successfully.' };
  }

  async getFriendStatus(
    userId: string,
    profileId: string,
  ): Promise<{ status: FriendStatus }> {
    if (!userId || !profileId || userId === '' || profileId === '') {
      throw new BadRequestException('The user ID and profile ID are required.');
    }

    if (userId === profileId) {
      throw new BadRequestException(
        'It is not possible to be friend with yourself.',
      );
    }

    const supabase = this.supabase.getClient();
    const { data: userFriends, error: userFriendsError } = await supabase
      .from('friends')
      .select('friend_id')
      .eq('user_id', userId); // we get the people the user asked to be friends with (ex: userFriendsData = [{friend_id: '1'}, {friend_id: '2'}])

    if (userFriendsError) {
      console.error(userFriendsError);
      throw new InternalServerErrorException(
        "An error occurred while getting the user's friends.",
      );
    }

    const {
      data: profileFriends,
      error: userWhoAskedToBeFriendWithCurrentUserError,
    } = await supabase
      .from('friends')
      .select('friend_id')
      .eq('user_id', profileId); // we get the people the profile asked to be friends with (ex: usersWhoAskedToBeFriendWithCurrentUserData = [{friend_id: '1'}, {friend_id: '3'}])

    if (userWhoAskedToBeFriendWithCurrentUserError) {
      console.error(userWhoAskedToBeFriendWithCurrentUserError);
      throw new InternalServerErrorException(
        "An error occurred while getting the profile's friends.",
      );
    }

    if (
      userFriends?.some((friend) => friend?.friend_id === profileId) &&
      profileFriends?.some((friend) => friend?.friend_id === userId) // if the user and the profile are friends
    ) {
      return { status: 'accepted' };
    } else if (userFriends?.some((friend) => friend?.friend_id === profileId)) {
      // if the user asked to be friends with the profile
      return { status: 'pending' };
    } else if (profileFriends?.some((friend) => friend?.friend_id === userId)) {
      // if the profile asked to be friends with the user
      return { status: 'requested' };
    } else {
      return { status: 'none' };
    }
  }
}
