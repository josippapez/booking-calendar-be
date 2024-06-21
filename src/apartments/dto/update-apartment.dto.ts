import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateApartmentDto {
  @ApiProperty()
  name: string;

  @ApiPropertyOptional({
    oneOf: [{ type: 'string' }, { type: 'string', format: 'binary' }],
  })
  image?: Express.Multer.File;

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

  @ApiPropertyOptional()
  pricePerNight?: number;
}
