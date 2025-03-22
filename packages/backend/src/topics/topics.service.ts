import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../common/supabase';

@Injectable()
export class TopicsService {
  constructor(private readonly supabase: SupabaseService) {}

  async getTopics(languageCode: string) {
    const supabase = this.supabase.getClient();
    const { error, data: topics } = await supabase
      .from('topic_translations')
      .select('name')
      .match({ language_code: languageCode, 'topics.production': true });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while fetching the topics.',
      );
    }

    return topics ?? [];
  }

  async getTopicsByIds(ids: number[], languageCode: string) {
    const supabase = this.supabase.getClient();
    const { error, data: topics } = await supabase
      .from('topic_translations')
      .select('name')
      .eq('language_code', languageCode)
      .in('topic_id', ids);

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while fetching the topics.',
      );
    }

    return topics ?? [];
  }

  async getTopicsByUserId(user_id: string, languageCode: string) {
    const supabase = this.supabase.getClient();
    const { data, error } = await supabase
      .from('user_topics')
      .select('topics(id)')
      .match({ user_id, 'topics.production': true });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while fetching the topics.',
      );
    }

    const topics = await this.getTopicsByIds(
      data?.map((item) => item.topics.id),
      languageCode,
    );

    const translatedTopics = Array.isArray(data)
      ? (topics?.map((item) => item) ?? [])
      : [];

    return translatedTopics;
  }

  async getTopicsCountByUserId(userId: string) {
    const supabase = this.supabase.getClient();
    const { count, error } = await supabase
      .from('user_topics')
      .select('id', {
        count: 'exact',
        head: true,
      })
      .match({ user_id: userId, 'topics.production': true });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while fetching the topics count.',
      );
    }

    const finalCount = count ?? 0;

    return { count: finalCount };
  }

  async updateUserTopics(userId: string, selectedTopics: number[]) {
    const supabase = this.supabase.getClient();
    const { data, error: errorUserTopics } = await supabase
      .from('user_topics')
      .select('topics(id)')
      .eq('user_id', userId);

    if (errorUserTopics) {
      console.error(errorUserTopics);
      throw new InternalServerErrorException(
        'An error occurred while fetching the user topics.',
      );
    }

    const userTopics = data?.map((item) => item.topics) ?? [];

    if (userTopics?.length > 0) {
      const topicsToRemove = userTopics
        .filter(
          (topic) =>
            !selectedTopics.some(
              (selectedTopic) => selectedTopic === topic?.id,
            ),
        )
        .filter(Boolean);

      if (topicsToRemove?.length > 0) {
        const { error } = await supabase
          .from('user_topics')
          .delete()
          .in(
            'topic_id',
            topicsToRemove.map((topic) => topic?.id),
          );

        if (error) {
          console.error(error);
          throw new InternalServerErrorException(
            'An error occurred while updating the topics.',
          );
        }
      }
    }

    const topicsToAdd = selectedTopics
      .filter(
        (selectedTopic) =>
          !userTopics.some((topic) => topic?.id === selectedTopic),
      )
      .filter(Boolean);

    if (topicsToAdd?.length > 0) {
      const { error: addError } = await supabase.from('user_topics').insert(
        topicsToAdd?.map((topic) => ({
          user_id: userId,
          topic_id: topic,
        })),
      );

      if (addError) {
        console.error(addError);
        throw new InternalServerErrorException(
          'An error occurred while updating the topics.',
        );
      }
    }

    return { success: true, message: 'Topics updated successfully.' };
  }

  async getSummariesCountByTopic() {
    const supabase = this.supabase.getClient();
    const { error, data } = await supabase
      .from('summaries')
      .select('topic_id')
      .eq('production', true);

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while fetching the summaries count by topic.',
      );
    }

    const summariesCount = data?.reduce(
      (acc: Record<number, number>, summary) => {
        const topicId = summary.topic_id;
        acc[topicId] = acc[topicId] ? acc[topicId] + 1 : 1;

        return acc;
      },
      {},
    );

    const arraySummariesCount = Object.entries(summariesCount).map(
      ([topicId, count]) => ({
        topicId: parseInt(topicId),
        count,
      }),
    );

    return arraySummariesCount;
  }

  async getUserTopicsProgression(userId: string) {
    const supabase = this.supabase.getClient();
    const { data, error } = await supabase
      .from('read_summaries')
      .select('summaries(topics(id))')
      .match({
        user_id: userId,
        'summaries.production': true,
        'summaries.topics.production': true,
      });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while fetching the user topics progression.',
      );
    }

    const topicsProgression = data?.reduce(
      (acc: Record<number, number>, summary) => {
        const topicId = summary?.summaries?.topics?.id;

        if (!topicId) {
          return acc;
        }

        acc[topicId] = acc[topicId] ? acc[topicId] + 1 : 1;

        return acc;
      },
      {},
    );

    const summariesCountByTopic = await this.getSummariesCountByTopic();

    const topicsProgressionWithCount = Object.entries(
      topicsProgression ?? [],
    ).map(([topicId, count]) => ({
      topicId: parseInt(topicId),
      count,
      total: summariesCountByTopic.find(
        (summary) => summary.topicId === parseInt(topicId),
      )?.count,
    }));

    return topicsProgressionWithCount;
  }
}
