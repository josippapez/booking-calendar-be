import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventsService } from '../events/events.service';
import { PublicEventsService } from '../publicEvents/publicEvents.service';
import { Apartment, ApartmentDocument } from '../schemas/apartments.schema';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { UpdateApartmentDto } from './dto/update-apartment.dto';

// function to encode file data to base64 encoded string
function base64_encode(file: Express.Multer.File) {
  // read binary data
  return file.buffer.toString('base64');
}

@Injectable()
export class ApartmentsService {
  constructor(
    @Inject(forwardRef(() => EventsService))
    private readonly eventsService: EventsService,
    @Inject(forwardRef(() => PublicEventsService))
    private readonly publicEventService: PublicEventsService,
    @InjectModel(Apartment.name)
    private apartmentModel: Model<ApartmentDocument>,
  ) {}

  async create(
    apartmentDto: CreateApartmentDto,
    image: Express.Multer.File | null | '',
    userId: string,
  ) {
    const base64Image = image ? base64_encode(image) : '';
    return this.apartmentModel.create({
      ...apartmentDto,
      userId,
      image: image ? 'data:' + image.mimetype + ';base64,' + base64Image : '',
    });
  }

  async update(
    id: string,
    apartmentDto: UpdateApartmentDto,
    image: Express.Multer.File | null | '',
    userId: string,
  ) {
    const base64Image = image ? base64_encode(image) : undefined;

    return this.apartmentModel.findOneAndUpdate(
      { _id: id, userId },
      image
        ? {
            ...apartmentDto,
            image: 'data:' + image.mimetype + ';base64,' + base64Image,
          }
        : apartmentDto,
      { new: true },
    );
  }

  async findAll(userId: string) {
    return this.apartmentModel.find({ userId }).lean().exec();
  }

  async findOne(id: string) {
    return this.apartmentModel.findById(id).lean().exec();
  }

  async remove(id: string, userId: string) {
    const apartment = await this.apartmentModel
      .deleteOne({ _id: id, userId })
      .exec();
    if (apartment) {
      this.eventsService.removeApartmentEvents(userId, id);
      this.publicEventService.removeApartmentEvents(userId, id);
      return apartment;
    } else {
      return null;
    }
  }
}
