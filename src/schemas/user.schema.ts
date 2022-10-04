import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  toJSON: {
    virtuals: true,
  },
  virtuals: 'id',
})
export class User {
  @Prop({ required: true, default: 'user' })
  role: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({})
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
