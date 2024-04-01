import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Apartment } from 'src/schemas/apartments.schema';

export class SingleApartmentDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  owner: string;

  @ApiProperty()
  pid: string;

  @ApiProperty()
  iban: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  image: string;

  @ApiPropertyOptional()
  pricePerNight: number;

  static mapFromEntity(apartment: Apartment): SingleApartmentDto {
    return !apartment
      ? undefined
      : {
          id: apartment._id,
          name: apartment.name,
          address: apartment.address,
          owner: apartment.owner,
          pid: apartment.pid,
          iban: apartment.iban,
          email: apartment.email,
          image: apartment.image,
          pricePerNight: apartment.pricePerNight,
        };
  }
}
