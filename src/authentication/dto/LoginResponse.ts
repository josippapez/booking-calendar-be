import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/schemas/user.schema';

export class LoginResponse {
  @ApiProperty()
  user: User;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
