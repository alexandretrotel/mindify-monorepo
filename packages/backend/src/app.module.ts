import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { SupabaseGuard, SupabaseModule } from './common/supabase';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { NotificationsModule } from './notifications/notifications.module';
import { MindifyAiModule } from './mindify-ai/mindify-ai.module';
import { AuthModule } from './auth/auth.module';
import { FriendModule } from './friend/friend.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { UserModule } from './user/user.module';
import { MindsModule } from './minds/minds.module';
import { MindModule } from './mind/mind.module';
import { SrsModule } from './srs/srs.module';
import { NotificationModule } from './notification/notification.module';
import { SummariesModule } from './summaries/summaries.module';
import { SummaryModule } from './summary/summary.module';
import { TopicsModule } from './topics/topics.module';
import { TopicModule } from './topic/topic.module';
import { ExpoModule } from './common/expo/expo.module';
import { AuthorsModule } from './authors/authors.module';
import { AuthorModule } from './author/author.module';
import { ChaptersModule } from './chapters/chapters.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule,
    SupabaseModule,
    UsersModule,
    NotificationsModule,
    MindifyAiModule,
    AuthModule,
    FriendModule,
    LeaderboardModule,
    UserModule,
    MindsModule,
    MindModule,
    SrsModule,
    NotificationModule,
    SummariesModule,
    SummaryModule,
    TopicsModule,
    TopicModule,
    ExpoModule,
    AuthorsModule,
    AuthorModule,
    ChaptersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: SupabaseGuard,
    },
  ],
})
export class AppModule {}
