import { Module } from '@nestjs/common';
import { SrsService } from './srs.service';
import { SupabaseModule } from '../common/supabase';
import { SrsController } from './srs.controller';

@Module({
  imports: [SupabaseModule],
  providers: [SrsService],
  controllers: [SrsController],
  exports: [SrsService],
})
export class SrsModule {}
