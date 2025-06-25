import { APP_STRINGS } from '@common/strings';
import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export class OptionalParseFloatPipe
  implements PipeTransform<string | undefined, number | undefined>
{
  transform(
    value: string | undefined,
    metadata: ArgumentMetadata,
  ): number | undefined {
    if (!value) return undefined;

    const val = parseFloat(value);
    if (isNaN(val)) {
      throw new BadRequestException(APP_STRINGS.common.pipes.validation_failed);
    }
    return val;
  }
}