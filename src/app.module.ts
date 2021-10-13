import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayersModule } from './players/players.module';
import { CategoriesModule } from './categories/categories.module';
import { ChallengesModule } from './challenges/challenges.module';
import { RankingsModule } from './rankings/rankings.module';

@Module({
  imports: [
    MongooseModule.forRoot(
    MongooseModule.forRoot('', {
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    ),
    PlayersModule,
    CategoriesModule,
    ChallengesModule,
    RankingsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
