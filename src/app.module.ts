import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from './categories/categories.module';
import { ChallengesModule } from './challenges/challenges.module';
import { PlayersModule } from './players/players.module';
import { RankingsModule } from './rankings/rankings.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/apismartranking', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    PlayersModule,
    CategoriesModule,
    ChallengesModule,
    RankingsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
