import { Module } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { SupabaseModule } from '../common/supabase';
import { AuthorsController } from './authors.controller';

@Module({
  imports: [SupabaseModule],
  controllers: [AuthorsController],
  providers: [AuthorsService],
  exports: [AuthorsService],
})
export class AuthorsModule {}
