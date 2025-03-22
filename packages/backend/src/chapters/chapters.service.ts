import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../common/supabase';

@Injectable()
export class ChaptersService {
  constructor(private readonly supabase: SupabaseService) {}

  async getChaptersFromId(chapterId: number, languageCode: string) {
    const supabase = this.supabase.getClient();
    const { data: chapters, error } = await supabase
      .from('chapter_translations')
      .select('titles, texts')
      .match({ chapter_id: chapterId, language_code: languageCode })
      .single();

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while fetching the chapters',
      );
    }

    return chapters;
  }
}
