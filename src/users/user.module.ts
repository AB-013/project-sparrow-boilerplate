import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserSubscriber } from './subscriber/user.subscriber';
import { UserRepository } from './user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])],
  providers: [UserSubscriber],
  exports: [TypeOrmModule],
})
export class UserModule {}
