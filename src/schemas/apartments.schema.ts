import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ApartmentDocument = Apartment & Document;

@Schema({
  toJSON: {
    virtuals: true,
  },
  virtuals: 'id',
})
export class Apartment {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({})
  owner: string;

  @Prop({})
  pid: string;

  @Prop({})
  iban: string;

  @Prop({ required: true })
  email: string;

  @Prop({})
  image: string;

  @Prop({ required: true })
  userid: string;
}

export const ApartmentSchema = SchemaFactory.createForClass(Apartment);
