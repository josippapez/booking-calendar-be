import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type ApartmentDocument = Apartment & Document;

@Schema({
  toJSON: {
    virtuals: true,
  },
  virtuals: 'id',
})
export class Apartment {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop({ required: true })
  address: string;

  @ApiProperty()
  @Prop({})
  owner: string;

  @ApiProperty()
  @Prop({})
  pid: string;

  @ApiProperty()
  @Prop({})
  iban: string;

  @ApiProperty()
  @Prop({ required: true })
  email: string;

  @ApiProperty()
  @Prop({})
  image: string;

  @ApiProperty()
  @Prop({ required: true })
  userid: string;

  @ApiPropertyOptional()
  @Prop()
  pricePerNight: number;
}

export const ApartmentSchema = SchemaFactory.createForClass(Apartment);
