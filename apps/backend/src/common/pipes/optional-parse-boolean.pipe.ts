import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class OptionalParseBooleanPipe implements PipeTransform {
  transform(value: any): boolean | undefined {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    const str = String(value).toLowerCase();
    if (str === 'true') return true;
    if (str === 'false') return false;

    throw new BadRequestException(`Validation failed (boolean string expected): ${value}`);
  }
}
