import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../common/supabase';

@Injectable()
export class MindifyAiService {
  constructor(private readonly supabase: SupabaseService) {}

  async getUserTodayPromptsCount(userId: string) {
    const supabase = this.supabase.getClient();
    const { data: chats, error: errorChats } = await supabase
      .from('mindify_ai_chats')
      .select('id')
      .eq('user_id', userId);

    if (errorChats) {
      console.error(errorChats);
      throw new InternalServerErrorException(
        "An error occurred while fetching the user's chats.",
      );
    }

    if (!chats?.length) {
      throw new NotFoundException('No chats found for the user.');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count, error } = await supabase
      .from('mindify_ai_messages')
      .select('', { count: 'exact', head: true })
      .in(
        'chat_id',
        chats.map((chat) => chat.id),
      )
      .gte('created_at', today.toISOString());

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while fetching the messages.',
      );
    }

    const finalCount = count ?? 0;

    return { count: finalCount };
  }

  async createChat(userId: string) {
    const supabase = this.supabase.getClient();
    const { data: newChat, error: createError } = await supabase
      .from('mindify_ai_chats')
      .insert({ user_id: userId })
      .select()
      .single();

    if (createError) {
      console.error(createError);
      throw new InternalServerErrorException(
        'An error occurred while creating the chat.',
      );
    }

    return newChat;
  }

  async deleteAllMessages(userId: string, chatId: number) {
    const supabase = this.supabase.getClient();
    const { error } = await supabase
      .from('mindify_ai_chats')
      .delete()
      .match({ user_id: userId, id: chatId });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while deleting the chat.',
      );
    }

    return {
      success: true,
      message: 'All messages have been successfully deleted.',
    };
  }

  async fetchChatId(userId: string) {
    const supabase = this.supabase.getClient();
    const { data, error } = await supabase
      .from('mindify_ai_chats')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while fetching the chat id.',
      );
    }

    return { id: data.id };
  }
}
