import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { validate as isUUID } from 'uuid';

@Injectable()
export class OptionalParseUUIDPipe
  implements PipeTransform<string | undefined, string | undefined>
{
  transform(value: string | undefined): string | undefined {
    if (value === undefined) return undefined;

    if (!isUUID(value)) {
      throw new BadRequestException(
        'Validation failed: UUID string is expected',
      );
    }
    return value;
  }
}
