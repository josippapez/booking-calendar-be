import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PublicEventDocument = PublicEvent & Document;

@Schema({
  toJSON: {
    virtuals: true,
  },
  virtuals: 'id',
})
export class PublicEvent {
  @Prop({ required: true, type: 'Mixed' })
  data: any;

  @Prop({ required: true })
  userid: string;

  @Prop({ required: true, unique: true })
  apartmentid: string;
}

export const PublicEventSchema = SchemaFactory.createForClass(PublicEvent);
