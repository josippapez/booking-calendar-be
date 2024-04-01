import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateApartmentDto {
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
}
