import { Controller, Get, Param } from '@nestjs/common';
import { PublicEventsService } from './publicEvents.service';

@Controller('publicEvents')
export class PublicEventsController {
  constructor(private readonly eventsService: PublicEventsService) {}

  @Get(':id')
  findAllForApartment(@Param('id') id: string) {
    return this.eventsService.findAllForApartment(id);
  }
}
