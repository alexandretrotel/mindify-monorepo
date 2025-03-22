import { Module } from '@nestjs/common';
import { MindController } from './mind.controller';
import { MindService } from './mind.service';
import { SupabaseModule } from '../common/supabase';

@Module({
  imports: [SupabaseModule],
  controllers: [MindController],
  providers: [MindService],
  exports: [MindService],
})
export class MindModule {}
