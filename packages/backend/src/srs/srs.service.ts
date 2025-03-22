import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../common/supabase';
import {
  Card,
  createEmptyCard,
  FSRS,
  FSRSParameters,
  generatorParameters,
  Grade,
} from 'ts-fsrs';

@Injectable()
export class SrsService {
  constructor(private readonly supabase: SupabaseService) {}

  async updateSrsData(mindId: number, userId: string, grade: Grade) {
    const supabase = this.supabase.getClient();
    const { data: srsData, error: srsError } = await supabase
      .from('srs_data')
      .select('*')
      .match({ user_id: userId, mind_id: mindId })
      .maybeSingle();

    const cardExists = srsData !== null;

    const emptyCard = createEmptyCard();

    if (!cardExists) {
      const { error: insertError } = await supabase.from('srs_data').insert({
        due: emptyCard.due.toISOString(),
        stability: emptyCard.stability,
        difficulty: emptyCard.difficulty,
        elapsed_days: emptyCard.elapsed_days,
        scheduled_days: emptyCard.scheduled_days,
        reps: emptyCard.reps,
        lapses: emptyCard.lapses,
        last_review: emptyCard.last_review?.toISOString(),
        state: emptyCard.state,
        user_id: userId,
        mind_id: mindId,
      });

      if (insertError) {
        console.error(insertError);
        throw new InternalServerErrorException(
          'An error occurred while creating the SRS data',
        );
      }
    }

    if (srsError) {
      console.error(srsError);
      throw new InternalServerErrorException(
        'An error occurred while fetching the SRS data',
      );
    }

    const card: Card = {
      reps: srsData?.reps ?? emptyCard.reps,
      lapses: srsData?.lapses ?? emptyCard.lapses,
      stability: srsData?.stability ?? emptyCard.stability,
      difficulty: srsData?.difficulty ?? emptyCard.difficulty,
      elapsed_days: srsData?.elapsed_days ?? emptyCard.elapsed_days,
      scheduled_days: srsData?.scheduled_days ?? emptyCard.scheduled_days,
      state: srsData?.state ?? emptyCard.state,
      due: srsData?.due ? new Date(srsData.due) : emptyCard.due,
      last_review: srsData?.last_review
        ? new Date(srsData.last_review)
        : emptyCard.last_review,
    };

    const params: FSRSParameters = generatorParameters();
    const f: FSRS = new FSRS(params);
    const schedulingResult = f.next(
      cardExists ? card : emptyCard,
      new Date(),
      grade,
    );
    const updatedCard = schedulingResult.card;

    const { error: updateError } = await supabase.from('srs_data').upsert({
      due: updatedCard.due.toISOString(),
      stability: updatedCard.stability,
      difficulty: updatedCard.difficulty,
      elapsed_days: updatedCard.elapsed_days,
      scheduled_days: updatedCard.scheduled_days,
      reps: updatedCard.reps,
      lapses: updatedCard.lapses,
      last_review: updatedCard.last_review?.toISOString(),
      state: updatedCard.state,
      user_id: userId,
      mind_id: mindId,
    });

    if (updateError) {
      console.error(updateError);
      throw new InternalServerErrorException(
        'An error occurred while updating the SRS data',
      );
    }

    return { card: updatedCard };
  }

  async postUserLearningSession(
    totalTimeInMs: number,
    totalLength: number,
    userId: string,
  ) {
    const supabase = this.supabase.getClient();
    const { error } = await supabase.from('learning_sessions').insert({
      total_time: Math.max(0, totalTimeInMs),
      total_length: totalLength,
      user_id: userId,
    });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while saving the learning session',
      );
    }

    return { success: true, message: 'The learning session has been saved.' };
  }

  async getSrsData(userId: string) {
    const supabase = this.supabase.getClient();
    const { data, error } = await supabase
      .from('srs_data')
      .select('*, minds(*, summaries(title, authors(name)))')
      .match({ user_id: userId, 'minds.production': true });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while fetching the SRS data',
      );
    }

    const srsData =
      data
        ?.map((item) => {
          if (!item?.minds?.summaries?.authors) {
            return null;
          }

          return {
            ...item,
            minds: {
              ...item.minds,
              summaries: {
                ...item.minds.summaries,
                authors: {
                  name: item.minds.summaries.authors.name,
                },
              },
            },
          };
        })
        ?.filter((item) => item !== null) ?? [];

    return srsData;
  }
}
