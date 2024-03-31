import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PublicEventsService } from './publicEvents.service';

@ApiTags('PublicEvents')
@Controller('publicEvents')
export class PublicEventsController {
  constructor(private readonly eventsService: PublicEventsService) {}

  @Get(':id')
  findAllForApartment(@Param('id') id: string) {
    return this.eventsService.findAllForApartment(id);
  }
}
