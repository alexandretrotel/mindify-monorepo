import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../common/supabase';

@Injectable()
export class AuthorsService {
  constructor(private readonly supabase: SupabaseService) {}

  async getAuthors(languageCode: string) {
    const supabase = this.supabase.getClient();

    const { data, error } = await supabase
      .from('author_translations')
      .select('name, description')
      .eq('language_code', languageCode);

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        "An error occurred while fetching the authors' data.",
      );
    }

    return data;
  }

  async getAuthorsFromIds(ids: number[], languageCode: string) {
    const supabase = this.supabase.getClient();

    const { data, error } = await supabase
      .from('author_translations')
      .select('name, description')
      .eq('language_code', languageCode)
      .in('author_id', ids);

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        "An error occurred while fetching the authors' data from the provided IDs.",
      );
    }

    return data;
  }
}
