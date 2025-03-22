import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ExpoService } from './expo.service';

@Module({
  imports: [ConfigModule],
  providers: [ExpoService],
  exports: [ExpoService],
})
export class ExpoModule {}
