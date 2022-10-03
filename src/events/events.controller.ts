import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import RequestWithUser from '../authentication/requestWithUser.interface';
import { CreateEventDto } from './dto/create-event.dto';
import { RemoveEventDto } from './dto/remove-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsService } from './events.service';

@UseGuards(JwtAuthenticationGuard)
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post(':id')
  addNew(
    @Param('id') id: string,
    @Body() createEventDto: CreateEventDto,
    @Req() request: RequestWithUser,
  ) {
    return this.eventsService.addNew(
      createEventDto,
      request.user['_id'].valueOf(),
      id,
    );
  }

  @Patch(':id')
  updateExisting(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Req() request: RequestWithUser,
  ) {
    return this.eventsService.update(
      id,
      updateEventDto,
      request.user['_id'].valueOf(),
    );
  }

  @Get(':id')
  findAllForUser(@Param('id') id: string, @Req() request: RequestWithUser) {
    return this.eventsService.findAllForUser(request.user['_id'].valueOf(), id);
  }

  @Patch(':id/:eventid')
  removeEvent(
    @Param('id') id: string,
    @Req() request: RequestWithUser,
    @Body() removeEventDto: RemoveEventDto,
  ) {
    return this.eventsService.remove(
      id,
      request.user['_id'].valueOf(),
      removeEventDto,
    );
  }
}
