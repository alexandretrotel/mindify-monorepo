import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../common/supabase';

@Injectable()
export class TopicService {
  constructor(private readonly supabase: SupabaseService) {}

  async getTopicName(topicId: number, languageCode: string) {
    const supabase = this.supabase.getClient();
    const { error, data } = await supabase
      .from('topic_translations')
      .select('topic_id, name')
      .match({ topic_id: topicId, language_code: languageCode })
      .single();

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        "An error occurred while fetching the topic's name.",
      );
    }

    return { name: data.name };
  }

  async getTopicFromSummaryId(summaryId: number, languageCode: string) {
    const supabase = this.supabase.getClient();
    const { error, data } = await supabase
      .from('summaries')
      .select('topics(id)')
      .eq('id', summaryId)
      .single();

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while fetching the topic of the summary.',
      );
    }

    const { data: topicData, error: topicError } = await supabase
      .from('topic_translations')
      .select('name')
      .match({ topic_id: data.topics.id, language_code: languageCode })
      .single();

    if (topicError) {
      console.error(topicError);
      throw new InternalServerErrorException(
        'An error occurred while fetching the topic.',
      );
    }

    return { name: topicData.name };
  }
}
