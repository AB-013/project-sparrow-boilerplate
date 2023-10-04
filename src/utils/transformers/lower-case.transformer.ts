import { TransformFnParams } from 'class-transformer/types/interfaces';

import { MaybeType } from '@src/utils/types/maybe.type';

export const LowerCaseTransformer = (
  params: TransformFnParams,
): MaybeType<string> => params.value?.toLowerCase().trim();
