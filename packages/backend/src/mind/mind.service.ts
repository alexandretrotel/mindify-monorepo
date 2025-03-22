import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../common/supabase';

@Injectable()
export class MindService {
  constructor(private readonly supabase: SupabaseService) {}

  async saveMind(userId: string, mindId: number) {
    const supabase = this.supabase.getClient();
    const { error } = await supabase.from('saved_minds').insert({
      user_id: userId,
      mind_id: mindId,
    });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while saving the mind.',
      );
    }

    return { success: true, message: 'The mind has been saved successfully.' };
  }

  async unsaveMind(userId: string, mindId: number) {
    const supabase = this.supabase.getClient();
    const { error } = await supabase
      .from('saved_minds')
      .delete()
      .match({ mind_id: mindId, user_id: userId });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while unsaving the mind.',
      );
    }

    return {
      success: true,
      message: 'The mind has been unsaved successfully.',
    };
  }

  async likeMind(userId: string, mindId: number) {
    const supabase = this.supabase.getClient();
    const { error } = await supabase.from('liked_minds').insert({
      user_id: userId,
      mind_id: mindId,
    });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while liking the mind.',
      );
    }

    return { success: true, message: 'The mind has been liked successfully.' };
  }

  async unlikeMind(userId: string, mindId: number) {
    const supabase = this.supabase.getClient();
    const { error } = await supabase
      .from('liked_minds')
      .delete()
      .match({ mind_id: mindId, user_id: userId });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while unliking the mind.',
      );
    }

    return {
      success: true,
      message: 'The mind has been unliked successfully.',
    };
  }

  async isMindSaved(userId: string, mindId: number) {
    const supabase = this.supabase.getClient();
    const { data, error } = await supabase
      .from('saved_minds')
      .select('mind_id')
      .match({ mind_id: mindId, user_id: userId })
      .maybeSingle();

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while checking if the mind is saved.',
      );
    }

    const isSaved = data?.mind_id === mindId;

    return { value: isSaved };
  }

  async isMindLiked(userId: string, mindId: number) {
    const supabase = this.supabase.getClient();
    const { data, error } = await supabase
      .from('liked_minds')
      .select('mind_id')
      .match({ mind_id: mindId, user_id: userId })
      .maybeSingle();

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while checking if the mind is liked.',
      );
    }

    const isLiked = data?.mind_id === mindId;

    return { value: isLiked };
  }

  async getSavedMindCount(mindId: number) {
    const supabase = this.supabase.getClient();
    const { count, error } = await supabase
      .from('saved_minds')
      .select('mind_id, minds(production)', {
        count: 'exact',
        head: true,
      })
      .match({ mind_id: mindId, 'minds.production': true });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while fetching the saved minds count.',
      );
    }

    return { count };
  }

  async getLikedMindCount(mindId: number) {
    const supabase = this.supabase.getClient();
    const { count, error } = await supabase
      .from('liked_minds')
      .select('mind_id, minds(production)', {
        count: 'exact',
        head: true,
      })
      .match({ mind_id: mindId, 'minds.production': true });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while fetching the liked minds count.',
      );
    }

    return { count };
  }
}
