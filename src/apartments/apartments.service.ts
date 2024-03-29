import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventsService } from '../events/events.service';
import { PublicEventsService } from '../publicEvents/publicEvents.service';
import { Apartment, ApartmentDocument } from '../schemas/apartments.schema';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { UpdateApartmentDto } from './dto/update-apartment.dto';

@Injectable()
export class ApartmentsService {
  constructor(
    private readonly eventsService: EventsService,
    private readonly publicEventService: PublicEventsService,
    @InjectModel(Apartment.name)
    private apartmentModel: Model<ApartmentDocument>,
  ) {}

  create(apartmentDto: CreateApartmentDto, userid: string) {
    return this.apartmentModel.create({ ...apartmentDto, userid });
  }

  async update(id: string, apartmentDto: UpdateApartmentDto, userid: string) {
    return this.apartmentModel.findOneAndUpdate(
      { _id: id, userid },
      apartmentDto,
      { new: true },
    );
  }

  findAll(userid: string) {
    return this.apartmentModel.find({ userid });
  }

  async findOne(id: string) {
    const apartment = await this.apartmentModel.findById(id);
    return apartment;
  }

  remove(id: string, userid: string) {
    const apartment = this.apartmentModel.deleteOne({ _id: id, userid });
    if (apartment) {
      this.eventsService.removeApartmentEvents(userid, id);
      this.publicEventService.removeApartmentEvents(userid, id);
      return apartment;
    } else {
      return null;
    }
  }
}
