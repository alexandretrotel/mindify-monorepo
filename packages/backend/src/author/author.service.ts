import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../common/supabase';

@Injectable()
export class AuthorService {
  constructor(private readonly supabase: SupabaseService) {}

  async getAuthorById(authorId: number, languageCode: string) {
    const supabase = this.supabase.getClient();

    const { data, error } = await supabase
      .from('author_translations')
      .select('name, description')
      .match({ id: authorId, language_code: languageCode })
      .maybeSingle();

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        "An error occurred while fetching the author's data from the provided ID.",
      );
    }

    return data;
  }

  async getAuthorFromSummaryId(summaryId: number, languageCode: string) {
    const supabase = this.supabase.getClient();

    const { data, error } = await supabase
      .from('summaries')
      .select('authors(id)')
      .eq('id', summaryId)
      .single();

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        "An error occurred while fetching the author's data from the provided summary ID.",
      );
    }

    const { data: authorData, error: authorError } = await supabase
      .from('author_translations')
      .select('name, description')
      .match({
        author_id: data.authors.id,
        language_code: languageCode,
      })
      .single();

    if (authorError) {
      console.error(authorError);
      throw new InternalServerErrorException(
        "An error occurred while fetching the author's data from the provided IDs.",
      );
    }

    return authorData;
  }
}
