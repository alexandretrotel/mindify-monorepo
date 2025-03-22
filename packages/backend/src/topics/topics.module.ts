import { Module } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { SupabaseModule } from '../common/supabase';
import { TopicsController } from './topics.controller';

@Module({
  imports: [SupabaseModule],
  providers: [TopicsService],
  controllers: [TopicsController],
  exports: [TopicsService],
})
export class TopicsModule {}
