import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GuestDocument = Guest & Document;

@Schema({
  toJSON: {
    virtuals: true,
  },
  virtuals: 'id',
})
export class Guest {
  @Prop({ required: true, type: 'Mixed' })
  data: any;

  @Prop({ required: true, unique: true })
  apartmentid: string;

  @Prop({ required: true })
  userid: string;
}

export const GuestSchema = SchemaFactory.createForClass(Guest);
