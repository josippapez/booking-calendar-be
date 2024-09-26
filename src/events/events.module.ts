import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PublicEventsModule } from '../publicEvents/publicEvents.module';
import { Events, EventsSchema } from '../schemas/events.schema';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { GuestsModule } from 'src/guests/guests.module';

@Module({
  imports: [
    forwardRef(() => PublicEventsModule),
    forwardRef(() => GuestsModule),
    MongooseModule.forFeature([{ name: Events.name, schema: EventsSchema }]),
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
