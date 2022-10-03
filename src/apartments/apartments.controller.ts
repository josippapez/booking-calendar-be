import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import RequestWithUser from '../authentication/requestWithUser.interface';
import { ApartmentsService } from './apartments.service';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { UpdateApartmentDto } from './dto/update-apartment.dto';

@Controller('apartments')
export class ApartmentsController {
  constructor(private readonly apartmentsService: ApartmentsService) {}

  @UseGuards(JwtAuthenticationGuard)
  @Post()
  async create(
    @Body() createApartmentDto: CreateApartmentDto,
    @Req() request: RequestWithUser,
  ) {
    return await this.apartmentsService.create(
      createApartmentDto,
      request.user['_id'].valueOf(),
    );
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  async findAll(@Req() request: RequestWithUser) {
    return this.apartmentsService.findAll(request.user['_id'].valueOf());
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.apartmentsService.findOne(id);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateApartmentDto: UpdateApartmentDto,
    @Req() request: RequestWithUser,
  ) {
    return await this.apartmentsService.update(
      id,
      updateApartmentDto,
      request.user['_id'].valueOf(),
    );
  }

  @UseGuards(JwtAuthenticationGuard)
  @Delete(':id')
  async remove(@Req() request: RequestWithUser, @Param('id') id: string) {
    return this.apartmentsService.remove(id, request.user['_id'].valueOf());
  }
}
