import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';

import { IAppConfig } from '@src/config/app.config';
import { User } from '@src/users/user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  private readonly bcryptSalt: number;

  constructor(
    connection: DataSource,
    private readonly configService: ConfigService,
  ) {
    connection.subscribers.push(this);
    this.bcryptSalt = configService.get<IAppConfig>('app').bcryptSalt;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  listenTo(): string | Function {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>): Promise<void> {
    const { password } = event.entity;
    event.entity.password = await bcrypt.hash(password, this.bcryptSalt);
  }
}
