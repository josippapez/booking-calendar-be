import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateApartmentDto {
  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  image?: string;

  @ApiProperty()
  address: string;

  @ApiPropertyOptional()
  owner?: string;

  @ApiPropertyOptional()
  pid?: string;

  @ApiPropertyOptional()
  iban?: string;

  @ApiProperty()
  email: string;
}
