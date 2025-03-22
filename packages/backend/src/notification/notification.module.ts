import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { SupabaseModule } from '../common/supabase';
import { ExpoModule } from '../common/expo/expo.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [SupabaseModule, ExpoModule, UserModule],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
