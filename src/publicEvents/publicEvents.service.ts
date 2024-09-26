import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PublicEventsFiltersDto } from 'src/publicEvents/dto/public-events-filters.dto';
import { Apartment } from 'src/schemas/apartments.schema';
import { EventObject, EventsByYear } from 'src/schemas/events.schema';
import {
  PublicEventDocument,
  PublicEventObject,
  PublicEvents,
  PublicEventsByYear,
} from '../schemas/public-events.schema';

@Injectable()
export class PublicEventsService {
  constructor(
    @InjectModel(PublicEvents.name)
    private eventModel: Model<PublicEventDocument>,
    @InjectModel(Apartment.name)
    private readonly apartmentsModel: Model<Apartment>,
  ) {}

  async addNew(apartmentId: string, userId: string, newDates: EventsByYear) {
    const redactedDates = Object.keys(newDates).reduce(
      (acc: PublicEventsByYear, year: string) => {
        acc[year] = Object.keys(newDates[year]).reduce(
          (acc2: { [key: string]: PublicEventObject[] }, date: string) => {
            acc2[date] = newDates[year][date].map((event: EventObject) =>
              PublicEventObject.init({
                id: event.id,
                start: event.start,
                end: event.end,
              }),
            );
            return acc2;
          },
          {},
        );
        return acc;
      },
      {},
    );

    return this.eventModel.findOneAndUpdate(
      { userId, apartmentId },
      { data: redactedDates },
      {
        upsert: true,
        new: true,
      },
    );
  }

  async update(apartmentId: string, userId: string, newDates: EventsByYear) {
    const redactedDates = Object.keys(newDates).reduce(
      (acc: PublicEventsByYear, year: string) => {
        acc[year] = Object.keys(newDates[year]).reduce(
          (acc2: { [key: string]: PublicEventObject[] }, date: string) => {
            acc2[date] = newDates[year][date].map((event: EventObject) =>
              PublicEventObject.init({
                id: event.id,
                start: event.start,
                end: event.end,
              }),
            );
            return acc2;
          },
          {},
        );
        return acc;
      },
      {},
    );

    return this.eventModel.findOneAndUpdate(
      { userId, apartmentId },
      { data: redactedDates },
      {
        upsert: true,
        new: true,
      },
    );
  }

  async findAllForApartment(
    apartmentId: string,
    filter: PublicEventsFiltersDto,
  ) {
    const events = await this.eventModel
      .findOne(
        {
          apartmentId,
        },
        {
          data: {
            [filter.year]: 1,
          },
        },
      )
      .lean();

    try {
      const apartmentInfo = await this.apartmentsModel
        .findById(apartmentId, {
          email: 1,
          image: 1,
          name: 1,
        })
        .lean();

      console.log('APARTMENT INFO', apartmentInfo);

      return {
        apartmentEmail: apartmentInfo.email,
        apartmentLogo: apartmentInfo.image,
        apartmentName: apartmentInfo.name,
        events: PublicEvents.mapObjectToPublicEventObject(events, filter.month),
      };
    } catch (error) {
      throw new HttpException('Apartment not found', HttpStatus.NOT_FOUND);
    }
  }

  async remove(
    apartmentId: string,
    userId: string,
    eventToRemove: EventObject,
  ) {
    const existingEvents = await this.eventModel
      .findOne({
        userId,
        apartmentId,
      })
      .lean();

    if (existingEvents) {
      const filteredEvents = Object.keys(existingEvents.data).reduce(
        (acc: PublicEventsByYear, year: string) => {
          acc[year] = Object.keys(existingEvents.data[year]).reduce(
            (acc2: { [key: string]: PublicEventObject[] }, date: string) => {
              acc2[date] = existingEvents.data[year][date].filter(
                (event: PublicEventObject) => event.id !== eventToRemove.id,
              );
              if (acc2[date].length === 0) {
                delete acc2[date];
              }
              return acc2;
            },
            {},
          );
          if (Object.keys(acc[year]).length === 0) {
            delete acc[year];
          }
          return acc;
        },
        {},
      );

      await this.eventModel
        .findOneAndUpdate(
          { userId, apartmentId },
          { data: filteredEvents },
          {
            upsert: true,
            new: true,
          },
        )
        .lean();
    }
  }

  async removeApartmentEvents(userId: string, apartmentId: string) {
    return await this.eventModel.findOneAndDelete({
      userId,
      apartmentId,
    });
  }
}
