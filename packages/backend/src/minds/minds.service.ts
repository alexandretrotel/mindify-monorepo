import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../common/supabase';

@Injectable()
export class MindsService {
  constructor(private readonly supabase: SupabaseService) {}

  async areMindsSaved(mindIds: number[], userId: string) {
    const supabase = this.supabase.getClient();
    const { data, error } = await supabase
      .from('saved_minds')
      .select('mind_id')
      .eq('user_id', userId)
      .in('mind_id', mindIds);

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while checking if minds are saved.',
      );
    }

    const savedMinds = mindIds?.map((mindId) =>
      data?.some((savedMind) => savedMind?.mind_id === mindId),
    );

    return { values: savedMinds };
  }

  async areMindsLiked(mindIds: number[], userId: string) {
    const supabase = this.supabase.getClient();
    const { data, error } = await supabase
      .from('liked_minds')
      .select('mind_id')
      .eq('user_id', userId)
      .in('mind_id', mindIds);

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while checking if minds are liked.',
      );
    }

    const likedMinds = mindIds?.map((mindId) =>
      data?.some((likedMind) => likedMind?.mind_id === mindId),
    );

    return { values: likedMinds };
  }

  async getSavedMindsCount(userId: string) {
    const supabase = this.supabase.getClient();
    const { count, error } = await supabase
      .from('saved_minds')
      .select('user_id, minds(production)', {
        count: 'exact',
        head: true,
      })
      .match({ user_id: userId, 'minds.production': true });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while fetching the saved minds count.',
      );
    }

    const finalCount = count ?? 0;

    return { count: finalCount };
  }

  async getSavedMinds(userId: string) {
    const supabase = this.supabase.getClient();
    const { data, error } = await supabase
      .from('saved_minds')
      .select('*, minds(id, text, question, summaries(title, authors(name)))')
      .match({ user_id: userId, 'minds.production': true });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while fetching the saved minds.',
      );
    }

    const savedMinds =
      data
        ?.map((item) => {
          if (!item?.minds?.summaries?.authors) {
            return null;
          }

          return {
            id: item.minds.id,
            text: item.minds.text,
            question: item.minds.question,
            summary_title: item.minds?.summaries?.title,
            author_name: item.minds?.summaries?.authors?.name,
            created_at: item.created_at,
          };
        })
        ?.filter((item) => item !== null) ?? [];

    return savedMinds;
  }
}
