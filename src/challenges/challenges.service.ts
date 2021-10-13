import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriesService } from 'src/categories/categories.service';
import { PlayersService } from 'src/players/players.service';
import { AssociateMatchDTO } from './dtos/associateMatch.dto';
import { CreateChallengeDTO } from './dtos/createChallenge.dto';
import { UpdateChallengeDTO } from './dtos/updateChallenge.dto';
import { ChallengeStatus } from './interfaces/challenge-status.enum';
import { Challenge, Match } from './interfaces/challenge.interface';

/*
Desafio
*/

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    @InjectModel('Match') private readonly matchModel: Model<Match>,
    private readonly playersService: PlayersService,
    private readonly categoriesService: CategoriesService,
  ) {}

  private readonly logger = new Logger(ChallengesService.name);

  async create(createChallengeDTO: CreateChallengeDTO): Promise<Challenge> {
    /*
        Verificar se os jogadores informados estão cadastrados
        */

    const players = await this.playersService.getAll();

    createChallengeDTO.players.map((playerDTO) => {
      const playerFilter = players.filter(
        (player) => player._id == playerDTO._id,
      );

      if (playerFilter.length == 0) {
        throw new BadRequestException(`Player not found`);
      }
    });

    /*
        Verificar se o solicitante é um dos jogadores da partida
        */

    const challengerIsAPlayerOnTheMatch =
      await createChallengeDTO.players.filter(
        (player) => player._id == createChallengeDTO.challenger,
      );

    this.logger.log(
      `challengerIsAPlayerOfTheMatch: ${challengerIsAPlayerOnTheMatch}`,
    );

    if (challengerIsAPlayerOnTheMatch.length == 0) {
      throw new BadRequestException(
        `The challenger must be a player on the match`,
      );
    }

    /*
        Descobrimos a categoria com base no ID do jogador solicitante
        */
    const challengerCategory = await this.categoriesService.getPlayerCategory(
      createChallengeDTO.challenger,
    );

    /*
        Para prosseguir o solicitante deve fazer parte de uma categoria
        */
    if (!challengerCategory) {
      throw new BadRequestException(
        `The challenger must be associated with a category`,
      );
    }

    const createdChallenge = new this.challengeModel(createChallengeDTO);
    createdChallenge.category = challengerCategory.category;
    createdChallenge.dateAndTime = new Date();
    /*
        Quando um desafio for criado, definimos o status desafio como pendente
        */
    createdChallenge.status = ChallengeStatus.PENDING;
    this.logger.log(`createdChallenge: ${JSON.stringify(createdChallenge)}`);
    return await createdChallenge.save();
  }

  async getAll(): Promise<Array<Challenge>> {
    return await this.challengeModel
      .find()
      .populate('challenger')
      .populate('players')
      .populate('match')
      .exec();
  }

  async getAllByPlayerId(_id: any): Promise<Array<Challenge>> {
    const players = await this.playersService.getAll();

    const playerFilter = players.filter((player) => player._id == _id);

    if (playerFilter.length == 0) {
      throw new BadRequestException(`Player not found`);
    }

    return await this.challengeModel
      .find()
      .where('players')
      .in(_id)
      .populate('challenger')
      .populate('players')
      .populate('match')
      .exec();
  }

  async update(
    _id: string,
    updateChallengeDTO: UpdateChallengeDTO,
  ): Promise<void> {
    const foundChallenge = await this.challengeModel.findById(_id).exec();

    if (!foundChallenge) {
      throw new NotFoundException(`Challenge not found`);
    }

    /*
        Atualizaremos a data da resposta quando o status do desafio vier preenchido 
        */
    if (updateChallengeDTO.status) {
      foundChallenge.responseDateAndTime = new Date();
    }
    foundChallenge.status = updateChallengeDTO.status;
    foundChallenge.dateAndTime = updateChallengeDTO.dateAndTime;

    await this.challengeModel
      .findOneAndUpdate({ _id }, { $set: foundChallenge })
      .exec();
  }

  async associateMatch(
    _id: string,
    associateMatch: AssociateMatchDTO,
  ): Promise<void> {
    const foundChallenge = await this.challengeModel.findById(_id).exec();

    if (!foundChallenge) {
      throw new BadRequestException(`Challenge not found`);
    }

    /*
        Verificar se o jogador vencedor faz parte do desafio
        */
    const playerFilter = foundChallenge.players.filter(
      (player) => player._id == associateMatch.def,
    );

    this.logger.log(`foundChallenge: ${foundChallenge}`);
    this.logger.log(`playerFilter: ${playerFilter}`);

    if (playerFilter.length == 0) {
      throw new BadRequestException(`The winner was not on this match`);
    }

    /*
        Primeiro vamos criar e persistir o objeto partida
        */
    const createdMatch = new this.matchModel(associateMatch);

    /*
       Atribuir ao objeto partida a categoria recuperada no desafio
       */
    createdMatch.category = foundChallenge.category;

    /*
       Atribuir ao objeto partida os jogadores que fizeram parte do desafio
       */
    createdMatch.players = foundChallenge.players;

    const result = await createdMatch.save();

    /*
        Quando uma partida for registrada por um usuário, mudaremos o 
        status do desafio para realizado
        */
    foundChallenge.status = ChallengeStatus.DONE;

    /*  
        Recuperamos o ID da partida e atribuimos ao desafio
        */
    foundChallenge.match = result._id;

    try {
      await this.challengeModel
        .findOneAndUpdate({ _id }, { $set: foundChallenge })
        .exec();
    } catch (error) {
      /*
            Se a atualização do desafio falhar excluímos a partida 
            gravada anteriormente
            */
      await this.matchModel.deleteOne({ _id: result._id }).exec();
      throw new InternalServerErrorException();
    }
  }

  async remove(_id: string): Promise<void> {
    const foundChallenge = await this.challengeModel.findById(_id).exec();

    if (!foundChallenge) {
      throw new BadRequestException(`Challenge not found`);
    }

    /*
        Realizaremos a deleção lógica do desafio, modificando seu status para
        CANCELADO
        */
    foundChallenge.status = ChallengeStatus.CANCELLED;

    await this.challengeModel
      .findOneAndUpdate({ _id }, { $set: foundChallenge })
      .exec();
  }
}
