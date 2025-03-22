import { Module } from '@nestjs/common';
import { TopicService } from './topic.service';
import { SupabaseModule } from '../common/supabase';
import { TopicController } from './topic.controller';

@Module({
  imports: [SupabaseModule],
  providers: [TopicService],
  controllers: [TopicController],
  exports: [TopicService],
})
export class TopicModule {}
