import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PublicEventsFiltersDto } from 'src/publicEvents/dto/public-events-filters.dto';
import {
  PublicEventObject,
  PublicEventsResponse,
} from 'src/schemas/public-events.schema';
import { PublicEventsService } from './publicEvents.service';

@ApiTags('PublicEvents')
@Controller('publicEvents')
export class PublicEventsController {
  constructor(private readonly eventsService: PublicEventsService) {}

  @ApiResponse({
    status: 200,
    description: 'Get all events for apartment',
    type: PublicEventsResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'No events found for apartment',
  })
  @ApiExtraModels(PublicEventObject)
  @Get(':apartmentId')
  async findAllForApartment(
    @Param('apartmentId') id: string,
    @Query()
    filters: PublicEventsFiltersDto,
  ) {
    return await this.eventsService.findAllForApartment(id, filters);
  }
}
