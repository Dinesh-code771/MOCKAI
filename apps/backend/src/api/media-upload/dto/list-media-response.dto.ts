export class ListMediaResponseDto<T> {
  statusCode: number;
  message: string;
  data: T[];
}
