import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'src/logger/logger.module';

import { UserController } from './user.controller';
import { UserModule } from './user.module';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [UserModule, ConfigModule, LoggerModule],
  providers: [UserService, UserRepository],
  exports: [UserService],
  controllers: [UserController],
})
export class UserHttpModule {}
