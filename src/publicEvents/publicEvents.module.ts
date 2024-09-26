import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Apartment, ApartmentSchema } from '../schemas/apartments.schema';
import {
  PublicEvents,
  PublicEventsSchema,
} from '../schemas/public-events.schema';
import { PublicEventsController } from './publicEvents.controller';
import { PublicEventsService } from './publicEvents.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PublicEvents.name, schema: PublicEventsSchema },
      { name: Apartment.name, schema: ApartmentSchema },
    ]),
  ],
  controllers: [PublicEventsController],
  providers: [PublicEventsService],
  exports: [PublicEventsService],
})
export class PublicEventsModule {}
