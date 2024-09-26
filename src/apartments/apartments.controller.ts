import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SingleApartmentDto } from 'src/apartments/dto/single-apartment.dto';
import { WebhookInterceptor } from 'src/interceptors/webhook.interceptor';
import { ApiErrorResponse } from 'src/schemas/error';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import RequestWithUser from '../authentication/requestWithUser.interface';
import { ApartmentsService } from './apartments.service';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { UpdateApartmentDto } from './dto/update-apartment.dto';

@ApiTags('Apartments')
@Controller('apartments')
export class ApartmentsController {
  constructor(private readonly apartmentsService: ApartmentsService) {}

  @ApiResponse({
    status: 201,
    description: 'Create apartment',
    type: SingleApartmentDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ApiErrorResponse,
  })
  @UseGuards(JwtAuthenticationGuard)
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createApartmentDto: CreateApartmentDto,
    @UploadedFile() image,
    @Req() request: RequestWithUser,
  ) {
    const apartment = await this.apartmentsService.create(
      createApartmentDto,
      image,
      request.user['_id'].valueOf(),
    );
    return SingleApartmentDto.mapFromEntity(apartment);
  }

  @ApiResponse({
    status: 200,
    description: 'Get all apartments',
    type: [SingleApartmentDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ApiErrorResponse,
  })
  @UseGuards(JwtAuthenticationGuard)
  @Get()
  async findAll(@Req() request: RequestWithUser) {
    const apartments = await this.apartmentsService.findAll(
      request.user['_id'].valueOf(),
    );
    return apartments.map((apartment) =>
      SingleApartmentDto.mapFromEntity(apartment),
    );
  }

  @ApiResponse({
    status: 200,
    description: 'Get one apartment',
    type: SingleApartmentDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ApiErrorResponse,
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const apartment = await this.apartmentsService.findOne(id);
    return SingleApartmentDto.mapFromEntity(apartment);
  }

  @ApiResponse({
    status: 200,
    description: 'Update one apartment',
    type: SingleApartmentDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ApiErrorResponse,
  })
  @UseGuards(JwtAuthenticationGuard)
  @Patch(':apartmentId')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @UseInterceptors(WebhookInterceptor)
  async update(
    @Param('apartmentId') id: string,
    @UploadedFile() image,
    @Body() updateApartmentDto: UpdateApartmentDto,
    @Req() request: RequestWithUser,
  ) {
    const apartment = await this.apartmentsService.update(
      id,
      updateApartmentDto,
      image,
      request.user['_id'].valueOf(),
    );
    return SingleApartmentDto.mapFromEntity(apartment);
  }

  @ApiResponse({
    status: 200,
    description: 'Delete one apartment',
    type: SingleApartmentDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ApiErrorResponse,
  })
  @UseGuards(JwtAuthenticationGuard)
  @Delete(':apartmentId')
  @UseInterceptors(WebhookInterceptor)
  async remove(
    @Req() request: RequestWithUser,
    @Param('apartmentId') id: string,
  ) {
    return await this.apartmentsService.remove(
      id,
      request.user['_id'].valueOf(),
    );
  }
}
