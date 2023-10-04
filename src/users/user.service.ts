import { Injectable } from '@nestjs/common';
import { EntityCondition } from 'src/utils/types/entity-condition.type';

import { LoggerService } from '@src/logger/logger.service';
import { BaseService } from '@src/utils/base.service';

import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService extends BaseService<User, UserRepository> {
  constructor(repository: UserRepository, logger: LoggerService) {
    super(repository, logger);
  }

  findByEmail(email: string): Promise<User | null> {
    const where: EntityCondition<User> = { email };
    return this.repository.findOne({ where });
  }

  getInactiveUsers(): Promise<User[]> {
    return this.repository.getInactiveUsers();
  }
}
