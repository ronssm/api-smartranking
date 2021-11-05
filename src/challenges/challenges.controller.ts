import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { AssociateMatchDTO } from './dtos/associateMatch.dto';
import { CreateChallengeDTO } from './dtos/createChallenge.dto';
import { UpdateChallengeDTO } from './dtos/updateChallenge.dto';
import { Challenge } from './interfaces/challenge.interface';
import { ChallengeStatusValidatorPipe } from './pipes/challenge-status-validator';

/*
Desafio
*/

@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  private readonly logger = new Logger(ChallengesController.name);

  @Post()
  @UsePipes(ValidationPipe)
  async create(
    @Body() createChallengeDTO: CreateChallengeDTO,
  ): Promise<Challenge> {
    this.logger.log(
      `createChallengeDTO: ${JSON.stringify(createChallengeDTO)}`,
    );
    return this.challengesService.create(createChallengeDTO);
  }

  @Get()
  async get(@Query('playerId') _id: string): Promise<Array<Challenge>> {
    return _id
      ? this.challengesService.getAllByPlayerId(_id)
      : this.challengesService.getAll();
  }

  @Put('/:_id')
  async update(
    @Body(ChallengeStatusValidatorPipe) updateChallengeDTO: UpdateChallengeDTO,
    @Param('_id') _id: string,
  ): Promise<void> {
    await this.challengesService.update(_id, updateChallengeDTO);
  }

  @Post('/:_id/match/')
  async associateMatch(
    @Body(ValidationPipe) associateMatchDTO: AssociateMatchDTO,
    @Param('_id') _id: string,
  ): Promise<void> {
    return this.challengesService.associateMatch(_id, associateMatchDTO);
  }

  @Delete('/:_id')
  async remove(@Param('_id') _id: string): Promise<void> {
    await this.challengesService.remove(_id);
  }
}
