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
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateGuestDto } from 'src/guests/dto/create-gudest.dto';
import { UpdateGuestDto } from 'src/guests/dto/update-guest.dto';
import { ApiErrorResponse } from 'src/schemas/error';
import { GuestObject, Guests } from 'src/schemas/guests.schema';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import RequestWithUser from '../authentication/requestWithUser.interface';
import { RemoveGuestDto } from './dto/remove-guest.dto';
import { GuestsService } from './guests.service';

@ApiTags('Guests')
@UseGuards(JwtAuthenticationGuard)
@Controller('guests')
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  @ApiResponse({
    status: 201,
    description: 'Created guest',
    type: GuestObject,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: ApiErrorResponse,
  })
  @Post()
  async create(
    @Query('apartmentId') apartmentId: string,
    @Body() createGuestDto: CreateGuestDto,
    @Req() request: RequestWithUser,
  ) {
    return await this.guestsService.create(
      createGuestDto,
      request.user['_id'].valueOf(),
      apartmentId,
    );
  }

  @ApiResponse({
    status: 200,
    description: 'Get guests',
    type: Guests,
  })
  @Get()
  async findAll(
    @Query('apartmentId') id: string,
    @Query('selectedYear') selectedYear: string,
    @Req() request: RequestWithUser,
  ) {
    return await this.guestsService.findAll(
      id,
      request.user['_id'].valueOf(),
      selectedYear,
    );
  }

  @ApiResponse({
    status: 200,
    description: 'Updated guest',
    type: Guests,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: ApiErrorResponse,
  })
  @Patch()
  async update(
    @Query('apartmentId') apartmentId: string,
    @Body() updateGuestDto: UpdateGuestDto,
    @Req() request: RequestWithUser,
  ) {
    return await this.guestsService.update(
      request.user['_id'].valueOf(),
      apartmentId,
      updateGuestDto,
    );
  }

  @ApiResponse({
    status: 200,
    description: 'Get guest',
    type: Guests,
  })
  @Get('guest')
  async findOne(
    @Query('guestId') guestId: string,
    @Query('apartmentId') id: string,
    @Query('selectedYear') selectedYear: string,
    @Req() request: RequestWithUser,
  ) {
    return await this.guestsService.findOne(
      id,
      request.user['_id'].valueOf(),
      selectedYear,
      guestId,
    );
  }

  @ApiResponse({
    status: 200,
    description: 'Updated guest',
    type: Guests,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: ApiErrorResponse,
  })
  @Delete(':apartmentId')
  async remove(
    @Param('apartmentId') apartmentId: string,
    @Req() request: RequestWithUser,
    @Body() removeGuestDto: RemoveGuestDto,
  ) {
    return await this.guestsService.remove(
      request.user['_id'].valueOf(),
      apartmentId,
      removeGuestDto,
    );
  }
}
