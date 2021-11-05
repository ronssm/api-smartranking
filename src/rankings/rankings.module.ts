import { Module } from '@nestjs/common';
import { RankingsController } from './rankings.controller';
import { RankingsService } from './rankings.service';

@Module({
  providers: [RankingsService],
  controllers: [RankingsController],
})
export class RankingsModule {}
