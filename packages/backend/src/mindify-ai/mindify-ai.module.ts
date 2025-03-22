import { Module } from '@nestjs/common';
import { MindifyAiController } from './mindify-ai.controller';
import { MindifyAiService } from './mindify-ai.service';
import { SupabaseModule } from '../common/supabase';

@Module({
  imports: [SupabaseModule],
  controllers: [MindifyAiController],
  providers: [MindifyAiService],
  exports: [MindifyAiService],
})
export class MindifyAiModule {}
