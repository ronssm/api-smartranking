import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ChallengeStatus } from '../interfaces/challenge-status.enum';

export class ChallengeStatusValidatorPipe implements PipeTransform {
  readonly allowedStatuses = [
    ChallengeStatus.ACCEPTED,
    ChallengeStatus.DENIED,
    ChallengeStatus.CANCELLED,
  ];

  transform(value: any) {
    const status = value.status.toUpperCase();

    if (!this.isValid(status)) {
      throw new BadRequestException(`${status} is invalid`);
    }

    return value;
  }

  private isValid(status: any) {
    const idx = this.allowedStatuses.indexOf(status);
    // -1 se o elemento não for encontrado
    return idx !== -1;
  }
}
