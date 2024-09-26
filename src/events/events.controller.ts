import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EventsFiltersDto } from 'src/events/dto/events-filters.dto';
import { ApiErrorResponse } from 'src/schemas/error';
import { EventObject, Events } from 'src/schemas/events.schema';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import RequestWithUser from '../authentication/requestWithUser.interface';
import { CreateEventDto } from './dto/create-event.dto';
import { RemoveEventDto } from './dto/remove-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsService } from './events.service';
import { WebhookInterceptor } from 'src/interceptors/webhook.interceptor';

@ApiTags('Events')
@UseGuards(JwtAuthenticationGuard)
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiResponse({
    status: 201,
    description: 'Event created',
    type: Events,
  })
  @UseInterceptors(WebhookInterceptor)
  @Post(':apartmentId')
  async addNew(
    @Param('apartmentId') apartmentId: string,
    @Body() createEventDto: CreateEventDto,
    @Req() request: RequestWithUser,
  ) {
    return await this.eventsService.addNew(
      createEventDto,
      request.user['_id'].valueOf(),
      apartmentId,
    );
  }

  @UseInterceptors(WebhookInterceptor)
  @Patch(':apartmentId')
  async updateExisting(
    @Param('apartmentId') apartmentId: string,
    @Body() updateEventDto: UpdateEventDto,
    @Req() request: RequestWithUser,
  ) {
    return await this.eventsService.update(
      apartmentId,
      updateEventDto,
      request.user['_id'].valueOf(),
    );
  }

  @ApiResponse({
    status: 200,
    description: 'Get all events for apartment',
    type: Events,
  })
  @ApiExtraModels(EventObject)
  @Get(':apartmentId')
  async findAllForUser(
    @Param('apartmentId') apartmentId: string,
    @Query()
    filters: EventsFiltersDto,
    @Req() request: RequestWithUser,
  ) {
    return await this.eventsService.findAllForUser(
      request.user['_id'].valueOf(),
      apartmentId,
      filters,
    );
  }

  @ApiResponse({
    status: 200,
    description: 'Event deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Event not found',
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: ApiErrorResponse,
  })
  @UseInterceptors(WebhookInterceptor)
  @Delete(':apartmentId')
  async removeEvent(
    @Param('apartmentId') apartmentId: string,
    @Req() request: RequestWithUser,
    @Body() removeEventDto: EventObject,
  ) {
    return await this.eventsService.remove(
      apartmentId,
      request.user['_id'].valueOf(),
      removeEventDto,
    );
  }
}
