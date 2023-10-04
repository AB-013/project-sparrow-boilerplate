import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

import { LowerCaseTransformer } from '@src/utils/transformers/lower-case.transformer';

export class AuthEmailLoginDto {
  @Transform(LowerCaseTransformer)
  email: string;

  @IsNotEmpty()
  password: string;
}
