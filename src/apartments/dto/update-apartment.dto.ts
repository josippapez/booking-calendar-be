import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateApartmentDto {
  @ApiProperty()
  id: string;

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
