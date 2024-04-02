import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiErrorResponse } from 'src/schemas/error';
import { Events } from 'src/schemas/events.schema';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import RequestWithUser from '../authentication/requestWithUser.interface';
import { CreateEventDto } from './dto/create-event.dto';
import { RemoveEventDto } from './dto/remove-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsService } from './events.service';

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
  @Get(':apartmentId')
  async findAllForUser(
    @Param('apartmentId') apartmentId: string,
    @Req() request: RequestWithUser,
  ) {
    const events = await this.eventsService
      .findAllForUser(request.user['_id'].valueOf(), apartmentId)
      .exec();

    return events;
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
  @Delete(':apartmentId')
  async removeEvent(
    @Param('apartmentId') apartmentId: string,
    @Req() request: RequestWithUser,
    @Body() removeEventDto: RemoveEventDto,
  ) {
    return await this.eventsService.remove(
      apartmentId,
      request.user['_id'].valueOf(),
      removeEventDto,
    );
  }
}
