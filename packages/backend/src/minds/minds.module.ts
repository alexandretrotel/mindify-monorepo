import { Module } from '@nestjs/common';
import { MindsController } from './minds.controller';
import { MindsService } from './minds.service';
import { SupabaseModule } from '../common/supabase';

@Module({
  imports: [SupabaseModule],
  controllers: [MindsController],
  providers: [MindsService],
  exports: [MindsService],
})
export class MindsModule {}
