import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AuthorService } from 'src/author/author.service';
import { SupabaseService } from '../common/supabase';
import { TopicService } from 'src/topic/topic.service';
import { ChaptersService } from 'src/chapters/chapters.service';
import { SummaryDto } from '../common/dto/responses/summary.dto';

@Injectable()
export class SummariesService {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly author: AuthorService,
    private readonly topic: TopicService,
    private readonly chapters: ChaptersService,
  ) {}

  async getSummaries(languageCode: string) {
    const supabase = this.supabase.getClient();
    const { error, data } = await supabase
      .from('summary_translations')
      .select(
        '*, summaries(id, title, image_url, source_type, source_url, reading_time, created_at, authors(name, description), topics(name))',
      )
      .eq('summaries.production', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while fetching summaries',
      );
    }

    const summaries = await Promise.all(
      data
        ?.map(async (summary) => {
          if (!summary.summaries.authors || !summary.summaries.topics) {
            return null;
          }

          const author = await this.author.getAuthorFromSummaryId(
            summary.summaries.id,
            languageCode,
          );
          const topic = await this.topic.getTopicFromSummaryId(
            summary.summaries.id,
            languageCode,
          );

          return {
            id: summary.summaries.id,
            title: summary.title,
            image_url: summary.summaries.image_url,
            source_type: summary.summaries.source_type,
            source_url: summary.summaries.source_url,
            reading_time: summary.summaries.reading_time,
            created_at: summary.summaries.created_at,
            author_name: author?.name,
            author_description: author?.description,
            topic_name: topic?.name,
          };
        })
        ?.filter((summary) => summary !== null) ?? [],
    );

    return summaries;
  }

  async getSummariesByIds(ids: number[], languageCode: string) {
    const supabase = this.supabase.getClient();
    const { error, data } = await supabase
      .from('summary_translations')
      .select(
        '*, summaries(id, title, image_url, source_type, source_url, reading_time, created_at, authors(name, description), topics(name))',
      )
      .eq('summaries.production', true)
      .in('summary_id', ids);

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while fetching summaries',
      );
    }

    const summaries = await Promise.all(
      data
        ?.map(async (summary) => {
          if (!summary.summaries.authors || !summary.summaries.topics) {
            return null;
          }

          const author = await this.author.getAuthorFromSummaryId(
            summary.summaries.id,
            languageCode,
          );

          const topic = await this.topic.getTopicFromSummaryId(
            summary.summaries.id,
            languageCode,
          );

          return {
            id: summary.summaries.id,
            title: summary.title,
            image_url: summary.summaries.image_url,
            source_type: summary.summaries.source_type,
            source_url: summary.summaries.source_url,
            reading_time: summary.summaries.reading_time,
            created_at: summary.summaries.created_at,
            author_name: author?.name,
            author_description: author?.description,
            topic_name: topic?.name,
          };
        })
        ?.filter((summary) => summary !== null) ?? [],
    );

    return summaries;
  }

  async searchSummaries(query: string, languageCode: string) {
    const supabase = this.supabase.getClient();
    const { data, error } = await supabase
      .from('summary_translations')
      .select(
        '*, summaries(id, title, image_url, source_type, source_url, reading_time, created_at, authors(name, description), topics(name))',
      )
      .textSearch('title', query, {
        type: 'websearch',
      })
      .match({ 'summaries.production': true, language_code: languageCode });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while fetching summaries',
      );
    }

    const summaries =
      data
        ?.map((summary) => {
          if (!summary.summaries.authors) {
            return null;
          }

          return {
            id: summary.summaries.id,
            title: summary.title,
            image_url: summary.summaries.image_url,
            source_type: summary.summaries.source_type,
            source_url: summary.summaries.source_url,
            reading_time: summary.summaries.reading_time,
            created_at: summary.summaries.created_at,
            author_name: summary.summaries.authors.name,
            author_description: summary.summaries.authors.description,
            topic_name: summary.summaries.topics.name,
          };
        })
        ?.filter((summary) => summary !== null) ?? [];

    return summaries;
  }

  async getSummariesByTopicId(topicId: number, languageCode: string) {
    const supabase = this.supabase.getClient();
    const { error, data } = await supabase
      .from('summary_translations')
      .select(
        'title, summaries(id, image_url, source_type, source_url, reading_time, created_at, authors(name, description), topics(name))',
      )
      .match({
        topic_id: topicId,
        'summaries.production': true,
        language_code: languageCode,
      });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while fetching summaries',
      );
    }

    const summaries = data?.map((summary) => {
      return {
        id: summary.summaries.id,
        title: summary.title,
        image_url: summary.summaries.image_url,
        source_type: summary.summaries.source_type,
        source_url: summary.summaries.source_url,
        reading_time: summary.summaries.reading_time,
        created_at: summary.summaries.created_at,
        author_name: summary.summaries.authors.name,
        author_description: summary.summaries.authors.description,
        topic_name: summary.summaries.topics.name,
      };
    });

    return summaries;
  }

  async getBestRatedSummaries(languageCode: string) {
    const supabase = this.supabase.getClient();
    const { error, data } = await supabase
      .from('summary_ratings')
      .select(
        '*, summaries(id, title, image_url, source_type, source_url, reading_time, created_at, authors(name, description), topics(name))',
      )
      .match({ 'summaries.production': true, language_code: languageCode })
      .order('rating', { ascending: false });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while fetching summaries',
      );
    }

    const summaryIds = data.map((summary) => summary.summaries.id);

    const translatedSummaries = await this.getSummariesByIds(
      summaryIds,
      languageCode,
    );

    const translatedSummariesWithRating = translatedSummaries.map((summary) => {
      const rating = data.find(
        (rating) => rating.summaries.id === summary.id,
      )?.rating;

      return { rating, summaries: summary };
    });

    const summaries: {
      [key: number]: {
        rating: number;
        summary: SummaryDto;
      };
    } = translatedSummariesWithRating.reduce((acc, { rating, summaries }) => {
      const summary = summaries;

      if (!summary) {
        return acc;
      }

      return {
        ...acc,
        [summary.id]: {
          rating,
          summary,
        },
      };
    }, {});

    const bestRatedSummaries = Object.values(summaries)
      .sort((a, b) => b.rating - a.rating)
      .map((summary) => summary.summary);

    return bestRatedSummaries;
  }

  async getReadSummaries(userId: string) {
    const supabase = this.supabase.getClient();
    const { data, error } = await supabase
      .from('read_summaries')
      .select(
        '*, summaries(id, title, image_url, source_type, source_url, reading_time, created_at, authors(name, description), topics(name))',
      )
      .match({ user_id: userId, 'summaries.production': true });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while fetching read summaries',
      );
    }

    const readSummaries =
      data
        ?.map((item) => {
          if (!item?.summaries?.authors || !item?.summaries?.topics) {
            return null;
          }

          return {
            id: item.summaries.id,
            title: item.summaries.title,
            image_url: item.summaries.image_url,
            source_type: item.summaries.source_type,
            source_url: item.summaries.source_url,
            reading_time: item.summaries.reading_time,
            created_at: item.summaries.created_at,
            author_name: item.summaries.authors.name,
            author_description: item.summaries.authors.description,
            topic_name: item.summaries.topics.name,
          };
        })
        ?.filter((item) => item !== null) ?? [];

    return readSummaries;
  }

  async getSavedSummaries(userId: string) {
    const supabase = this.supabase.getClient();
    const { data, error } = await supabase
      .from('saved_summaries')
      .select(
        '*, summaries(id, title, image_url, source_type, source_url, reading_time, created_at, authors(name, description), topics(name))',
      )
      .match({ user_id: userId, 'summaries.production': true });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while fetching saved summaries',
      );
    }

    const savedSummaries =
      data
        ?.map((item) => {
          if (!item?.summaries?.authors || !item?.summaries?.topics) {
            return null;
          }

          return {
            id: item.summaries.id,
            title: item.summaries.title,
            image_url: item.summaries.image_url,
            source_type: item.summaries.source_type,
            source_url: item.summaries.source_url,
            reading_time: item.summaries.reading_time,
            created_at: item.summaries.created_at,
            author_name: item.summaries.authors.name,
            author_description: item.summaries.authors.description,
            topic_name: item.summaries.topics.name,
          };
        })
        ?.filter((item) => item !== null) ?? [];

    return savedSummaries;
  }

  async getReadSummariesTimestamps(userId: string) {
    const supabase = this.supabase.getClient();
    const { data, error } = await supabase
      .from('read_summaries')
      .select('read_at')
      .match({ user_id: userId, 'summaries.production': true });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while fetching read summaries timestamps',
      );
    }

    const readSummariesTimestamps = data?.map((item) => item.read_at) ?? [];

    return { timestamps: readSummariesTimestamps };
  }

  async getReadSummariesCount(userId: string) {
    const supabase = this.supabase.getClient();
    const { count, error } = await supabase
      .from('read_summaries')
      .select('user_id, summaries(production)', {
        count: 'exact',
        head: true,
      })
      .match({ user_id: userId, 'summaries.production': true });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while fetching read summaries count',
      );
    }

    const finalCount = count ?? 0;

    return { count: finalCount };
  }
}
