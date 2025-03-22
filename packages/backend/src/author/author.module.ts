import { Module } from '@nestjs/common';
import { AuthorService } from './author.service';
import { SupabaseModule } from '../common/supabase';
import { AuthorController } from './author.controller';

@Module({
  imports: [SupabaseModule],
  controllers: [AuthorController],
  providers: [AuthorService],
  exports: [AuthorService],
})
export class AuthorModule {}
