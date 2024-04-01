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
    type: CreateEventDto,
  })
  @Post(':apartmentId')
  addNew(
    @Param('apartmentId') apartmentId: string,
    @Body() createEventDto: CreateEventDto,
    @Req() request: RequestWithUser,
  ) {
    return this.eventsService.addNew(
      createEventDto,
      request.user['_id'].valueOf(),
      apartmentId,
    );
  }

  @Patch(':apartmentId')
  updateExisting(
    @Param('apartmentId') apartmentId: string,
    @Body() updateEventDto: UpdateEventDto,
    @Req() request: RequestWithUser,
  ) {
    return this.eventsService.update(
      apartmentId,
      updateEventDto,
      request.user['_id'].valueOf(),
    );
  }

  @ApiResponse({
    status: 200,
    description: 'Get all events for user',
    // type: [CreateEventDto],
  })
  @Get(':apartmentId')
  findAllForUser(
    @Param('apartmentId') apartmentId: string,
    @Req() request: RequestWithUser,
  ) {
    return this.eventsService.findAllForUser(
      request.user['_id'].valueOf(),
      apartmentId,
    );
  }

  @Delete(':apartmentId')
  removeEvent(
    @Param('apartmentId') apartmentId: string,
    @Req() request: RequestWithUser,
    @Body() removeEventDto: RemoveEventDto,
  ) {
    return this.eventsService.remove(
      apartmentId,
      request.user['_id'].valueOf(),
      removeEventDto,
    );
  }
}
