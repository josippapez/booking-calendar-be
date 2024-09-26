import { ApiProperty } from '@nestjs/swagger';

export class ApiErrorResponse {
  @ApiProperty()
  public code: string;

  @ApiProperty()
  public message: string;

  constructor(code: string, message: string) {
    this.code = code;
    this.message = message;
  }

  static fromError(error: any) {
    return new ApiErrorResponse(
      error.code ?? 'Unknown',
      error.message ?? `${error}`,
    );
  }
}
