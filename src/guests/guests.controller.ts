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
import { CreateGuestDto } from './dto/create-guest.dto';
import { RemoveGuestDto } from './dto/remove-guest.dto';
import { GuestsService } from './guests.service';

@UseGuards(JwtAuthenticationGuard)
@Controller('guests')
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  @Post(':apartmentId')
  createOrUpdate(
    @Param('apartmentId') apartmentId: string,
    @Body() createGuestDto: CreateGuestDto,
    @Req() request: RequestWithUser,
  ) {
    return this.guestsService.createOrUpdate(
      createGuestDto,
      request.user['_id'].valueOf(),
      apartmentId,
    );
  }

  @Get()
  findAll() {
    return this.guestsService.findAll();
  }

  @Get(':id/:selectedyear')
  findOne(
    @Param('id') id: string,
    @Param('selectedyear') selectedyear: string,
    @Req() request: RequestWithUser,
  ) {
    return this.guestsService.findOne(
      id,
      request.user['_id'].valueOf(),
      selectedyear,
    );
  }

  @Patch(':apartmentId')
  remove(
    @Param('apartmentId') apartmentId: string,
    @Req() request: RequestWithUser,
    @Body() removeGuestDto: RemoveGuestDto,
  ) {
    return this.guestsService.remove(
      request.user['_id'].valueOf(),
      apartmentId,
      removeGuestDto,
    );
  }
}
