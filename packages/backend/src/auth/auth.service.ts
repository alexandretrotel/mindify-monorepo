import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../common/supabase';

@Injectable()
export class AuthService {
  constructor(private readonly supabase: SupabaseService) {}

  async updatePassword(newPassword: string) {
    const supabase = this.supabase.getClient();
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        "An error occurred while updating the user's password",
      );
    }

    return { success: true, message: 'Password updated successfully' };
  }
}
