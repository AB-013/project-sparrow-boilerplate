import { Global, Module } from '@nestjs/common';

import { UserHttpModule } from '@src/users/user-http.module';

import { PasswordConfirmValidator } from './password-confirm.validator';
import { UniqueEmailValidator } from './unique-email.validator';

@Global()
@Module({
  imports: [UserHttpModule],
  providers: [PasswordConfirmValidator, UniqueEmailValidator],
  exports: [PasswordConfirmValidator, UniqueEmailValidator],
})
export class ValidatorModule {}
