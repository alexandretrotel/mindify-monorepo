import { Module } from '@nestjs/common';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
import { SupabaseModule } from '../common/supabase';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [SupabaseModule, NotificationModule],
  controllers: [FriendController],
  providers: [FriendService],
  exports: [FriendService],
})
export class FriendModule {}
