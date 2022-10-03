import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Guest, GuestSchema } from '../schemas/guests.schema';
import { GuestsController } from './guests.controller';
import { GuestsService } from './guests.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Guest.name, schema: GuestSchema }]),
  ],
  controllers: [GuestsController],
  providers: [GuestsService],
})
export class GuestsModule {}
