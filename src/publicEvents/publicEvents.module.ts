import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PublicEvent, PublicEventSchema } from '../schemas/publicEvents.schema';
import { PublicEventsController } from './publicEvents.controller';
import { PublicEventsService } from './publicEvents.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PublicEvent.name, schema: PublicEventSchema },
    ]),
  ],
  controllers: [PublicEventsController],
  providers: [PublicEventsService],
  exports: [PublicEventsService],
})
export class PublicEventsModule {}
