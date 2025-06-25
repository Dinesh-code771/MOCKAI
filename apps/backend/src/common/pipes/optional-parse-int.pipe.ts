import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class OptionalParseIntPipe implements PipeTransform<string | undefined, number | undefined> {
  transform(value: any): number | undefined {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    if (typeof value === 'number') {
      return isNaN(value) ? undefined : value;
    }

    if (typeof value === 'string') {
      const val = parseInt(value, 10);
      return isNaN(val) ? undefined : val;
    }

    return undefined;
  }
}