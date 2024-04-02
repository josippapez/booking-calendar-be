import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PublicEvents,
  PublicEventsSchema,
} from '../schemas/publicEvents.schema';
import { PublicEventsController } from './publicEvents.controller';
import { PublicEventsService } from './publicEvents.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PublicEvents.name, schema: PublicEventsSchema },
    ]),
  ],
  controllers: [PublicEventsController],
  providers: [PublicEventsService],
  exports: [PublicEventsService],
})
export class PublicEventsModule {}
