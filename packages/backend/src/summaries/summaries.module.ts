import { Module } from '@nestjs/common';
import { SummariesController } from './summaries.controller';
import { SummariesService } from './summaries.service';
import { SupabaseModule } from '../common/supabase';
import { AuthorModule } from 'src/author/author.module';
import { TopicModule } from 'src/topic/topic.module';
import { ChaptersModule } from 'src/chapters/chapters.module';

@Module({
  imports: [SupabaseModule, AuthorModule, TopicModule, ChaptersModule],
  controllers: [SummariesController],
  providers: [SummariesService],
  exports: [SummariesService],
})
export class SummariesModule {}
