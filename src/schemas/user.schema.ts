import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  toJSON: {
    virtuals: true,
  },
  virtuals: 'id',
})
export class User {
  @ApiProperty()
  _id: string;

  @Prop({ required: true, default: 'user' })
  role: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({})
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
