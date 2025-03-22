import { Module } from '@nestjs/common';
import { SummaryService } from './summary.service';
import { SupabaseModule } from '../common/supabase';
import { SummaryController } from './summary.controller';
import { NotificationModule } from 'src/notification/notification.module';
import { AuthorModule } from 'src/author/author.module';
import { TopicModule } from 'src/topic/topic.module';
import { ChaptersModule } from 'src/chapters/chapters.module';

@Module({
  imports: [
    SupabaseModule,
    NotificationModule,
    AuthorModule,
    TopicModule,
    ChaptersModule,
  ],
  providers: [SummaryService],
  controllers: [SummaryController],
  exports: [SummaryService],
})
export class SummaryModule {}
