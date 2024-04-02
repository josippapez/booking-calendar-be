import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type PublicEventDocument = PublicEvents & Document;

export class PublicEventObject {
  @ApiProperty()
  id: string;

  @ApiProperty()
  start: string;

  @ApiProperty()
  end: string;

  static init({
    id,
    start,
    end,
  }: {
    id: string;
    start: string;
    end: string;
  }): PublicEventObject {
    const dto = new PublicEventObject();
    dto.id = id;
    dto.start = start;
    dto.end = end;
    return dto;
  }
}

export type PublicEventsByYear = {
  [key: string]:
    | {
        [key: string]: PublicEventObject[] | null | undefined;
      }
    | undefined
    | null;
};

@Schema({
  toJSON: {
    virtuals: true,
  },
  virtuals: 'id',
})
export class PublicEvents {
  @ApiProperty({
    default: {},
    nullable: true,
    additionalProperties: {
      type: 'object',
      nullable: true,
      additionalProperties: {
        type: 'array',
        nullable: true,
        items: {
          $ref: getSchemaPath(PublicEventObject),
        },
      },
    },
  })
  @Prop({ required: true, type: 'object', default: {} })
  data: PublicEventsByYear;

  @ApiProperty()
  @Prop({ required: true })
  userId: string;

  @ApiProperty()
  @Prop({ required: true, unique: true })
  apartmentId: string;
}

export const PublicEventsSchema = SchemaFactory.createForClass(PublicEvents);
