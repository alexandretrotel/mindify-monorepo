import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { NotificationService } from 'src/notification/notification.service';
import { SupabaseService } from '../common/supabase';
import { AuthorService } from 'src/author/author.service';
import { TopicService } from 'src/topic/topic.service';
import { ChaptersService } from 'src/chapters/chapters.service';

@Injectable()
export class SummaryService {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly notification: NotificationService,
    private readonly authorService: AuthorService,
    private readonly topicService: TopicService,
    private readonly chaptersService: ChaptersService,
  ) {}

  async getSummarySavedCount(summaryId: number) {
    const supabase = this.supabase.getClient();
    const { count, error } = await supabase
      .from('saved_summaries')
      .select('*, summaries(production)', { count: 'exact' })
      .match({ summary_id: summaryId, 'summaries.production': true });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while fetching the number of saves',
      );
    }

    const finalCount = count ?? 0;

    return { count: finalCount };
  }

  async getSummaryReadCount(summaryId: number) {
    const supabase = this.supabase.getClient();
    const { count, error } = await supabase
      .from('read_summaries')
      .select('*, summaries(production)', { count: 'exact' })
      .match({ summary_id: summaryId, 'summaries.production': true });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while fetching the number of reads',
      );
    }

    const finalCount = count ?? 0;

    return { count: finalCount };
  }

  async getSummaryRating(summaryId: number) {
    const supabase = this.supabase.getClient();
    const { data: ratings, error } = await supabase
      .from('summary_ratings')
      .select('rating')
      .eq('summary_id', summaryId);

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while fetching the summary rating',
      );
    }

    const averageRating =
      ratings.reduce((acc, rating) => acc + rating.rating, 0) / ratings.length;

    if (isNaN(averageRating)) {
      return { rating: 0 };
    }

    return { rating: averageRating };
  }

  async getSummary(summaryId: number, languageCode: string) {
    const supabase = this.supabase.getClient();
    const { data, error } = await supabase
      .from('summary_translations')
      .select(
        'title, summaries(*, authors(name, slug, description), topics(name, slug), chapters(*))',
      )
      .match({
        summary_id: summaryId,
        'summaries.production': true,
        language_code: languageCode,
      })
      .single();

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while fetching the summary',
      );
    }

    const author = await this.authorService.getAuthorFromSummaryId(
      summaryId,
      languageCode,
    );
    const topic = await this.topicService.getTopicFromSummaryId(
      summaryId,
      languageCode,
    );
    const chapters = await this.chaptersService.getChaptersFromId(
      data?.summaries?.chapters?.id,
      languageCode,
    );

    const summary = {
      id: summaryId,
      title: data.title,
      image_url: data.summaries.image_url,
      source_type: data.summaries.source_type,
      source_url: data.summaries.source_url,
      reading_time: data.summaries.reading_time,
      created_at: data.summaries.created_at,
      author_name: author.name,
      author_description: author.description,
      topic_name: topic.name,
      chapters,
    };

    return summary;
  }

  async rateSummary(userId: string, summaryId: number, rating: number) {
    const supabase = this.supabase.getClient();
    const { error } = await supabase
      .from('summary_ratings')
      .upsert({ user_id: userId, summary_id: summaryId, rating });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException('An error occurred while rating');
    }

    return { success: true, message: 'Summary rated successfully' };
  }

  async saveSummary(
    userId: string | null,
    summaryId: number,
    languageCode: string,
  ) {
    if (!userId) {
      throw new BadRequestException(
        "It's not possible to save a summary without being logged in.",
      );
    }

    const supabase = this.supabase.getClient();
    const { error } = await supabase.from('saved_summaries').insert({
      user_id: userId,
      summary_id: summaryId,
    });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while saving the summary.',
      );
    }

    const { title: summaryTitle } = await this.getSummaryTitle(
      summaryId,
      languageCode,
    );

    await this.notification.notifyFriendSavedSummary(
      userId,
      summaryId,
      summaryTitle,
    );

    return { success: true, message: 'Summary saved successfully' };
  }

  async unsaveSummary(userId: string, summaryId: number) {
    const supabase = this.supabase.getClient();
    const { error } = await supabase.from('saved_summaries').delete().match({
      user_id: userId,
      summary_id: summaryId,
    });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while unsaving the summary.',
      );
    }

    return { success: true, message: 'Summary unsaved successfully' };
  }

  async markSummaryAsRead(
    userId: string,
    summaryId: number,
    languageCode: string,
  ) {
    const supabase = this.supabase.getClient();
    const { error } = await supabase.from('read_summaries').insert({
      user_id: userId,
      summary_id: summaryId,
    });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while marking the summary as read.',
      );
    }

    const { title: summaryTitle } = await this.getSummaryTitle(
      summaryId,
      languageCode,
    );

    await this.notification.notifyFriendReadSummary(
      userId,
      summaryId,
      summaryTitle,
    );

    return { success: true, message: 'Summary marked as read successfully' };
  }

  async markSummaryAsUnread(userId: string, summaryId: number) {
    const supabase = this.supabase.getClient();
    const { error } = await supabase.from('read_summaries').delete().match({
      user_id: userId,
      summary_id: summaryId,
    });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while marking the summary as unread.',
      );
    }

    return { success: true, message: 'Summary marked as unread successfully' };
  }

  async isSummarySaved(userId: string, summaryId: number) {
    const supabase = this.supabase.getClient();
    const { data, error } = await supabase
      .from('saved_summaries')
      .select('*')
      .match({
        user_id: userId,
        summary_id: summaryId,
      })
      .maybeSingle();

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while checking if the summary is saved.',
      );
    }

    const isSaved = !!data;

    return { value: isSaved };
  }

  async isSummaryRead(userId: string, summaryId: number) {
    const supabase = this.supabase.getClient();
    const { data, error } = await supabase
      .from('read_summaries')
      .select('*')
      .match({
        user_id: userId,
        summary_id: summaryId,
      })
      .maybeSingle();

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while checking if the summary is read.',
      );
    }

    const isRead = !!data;

    return { value: isRead };
  }

  async getUserSummaryRating(userId: string, summaryId: number) {
    const supabase = this.supabase.getClient();
    const { data, error } = await supabase
      .from('summary_ratings')
      .select('rating')
      .match({ user_id: userId, summary_id: summaryId })
      .maybeSingle();

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while fetching the user rating',
      );
    }

    const rating = data?.rating ?? undefined;

    return { rating };
  }

  async getSummaryTitle(summaryId: number, languageCode: string) {
    const supabase = this.supabase.getClient();
    const { data, error } = await supabase
      .from('summary_translations')
      .select('title')
      .match({ id: summaryId, language_code: languageCode })
      .single();

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while fetching the summary title',
      );
    }

    const finalTitle = data?.title ?? '';

    return { title: finalTitle };
  }
}
