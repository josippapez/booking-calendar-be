import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DateTime } from 'luxon';
import { Model } from 'mongoose';
import { Day } from 'src/events/dto/EventType';
import { PublicEventsService } from '../publicEvents/publicEvents.service';
import {
  EventObject,
  Events,
  EventsByYear,
  EventsDocument,
} from '../schemas/events.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { RemoveEventDto } from './dto/remove-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

const eachDayOfRange = (startDate: string, endDate: string) => {
  const start = DateTime.fromISO(startDate);
  const end = DateTime.fromISO(endDate);
  const monthDates: Day[] = [];

  const daysInMonth = end.diff(start, 'days');
  for (let i = 0; i <= daysInMonth.days; i++) {
    const day = start.plus({ days: i });
    monthDates.push({
      day: day.day,
      date: day.toFormat('yyyy-MM-dd'),
      name: day.toFormat('EEEE'),
      year: day.year.toString(),
      lastMonth: false,
      weekNumber: day.weekNumber,
      startingDay: i === 0,
      endingDay: i === daysInMonth.days,
    });
  }

  return monthDates;
};

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Events.name)
    private eventModel: Model<EventsDocument>,
    private readonly publicEventService: PublicEventsService,
  ) {}

  async addNew(
    createEventDto: CreateEventDto,
    userId: string,
    apartmentId: string,
  ) {
    const existingEvents = (await this.eventModel
      .findOne({
        userId,
        apartmentId,
      })
      .exec()) || { data: {}, apartmentId, userId };

    const dates = eachDayOfRange(createEventDto.start, createEventDto.end);

    const eventObject = EventObject.init({
      ...createEventDto,
    });

    const newDates = dates.reduce(
      (acc: EventsByYear, date: Day) => ({
        ...acc,
        [date.year]: {
          ...acc[date.year],
          [date.date]: [
            ...((existingEvents?.data[date.year] &&
              existingEvents?.data[date.year][date.date]) ||
              []),
            { ...eventObject, weekNumber: date.weekNumber },
          ],
        },
      }),
      {},
    );

    Object.keys(newDates).map((year) => {
      existingEvents.data[year] = {
        ...existingEvents?.data[year],
        ...newDates[year],
      };
    });

    this.publicEventService.addNew(apartmentId, userId, existingEvents.data);

    return this.eventModel
      .findOneAndUpdate(
        { userId, apartmentId },
        { data: existingEvents.data },
        {
          upsert: true,
          new: true,
        },
      )
      .exec();
  }

  async update(
    apartmentId: string,
    updateEventDto: UpdateEventDto,
    userId: string,
  ) {
    const existingEvents = await this.eventModel
      .findOne({
        userId,
        apartmentId,
      })
      .exec();

    if (existingEvents) {
      const dates = eachDayOfRange(
        updateEventDto.updatedEvent.start,
        updateEventDto.updatedEvent.end,
      );

      const filteredEvents = Object.keys(existingEvents.data).reduce(
        (acc: EventsByYear, year: string) => {
          acc[year] = Object.keys(existingEvents.data[year]).reduce(
            (acc2: { [key: string]: EventObject[] }, date: string) => {
              acc2[date] = existingEvents.data[year][date].filter(
                (event: EventObject) => event.id !== updateEventDto.oldEvent.id,
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

      const newDates = dates.reduce(
        (acc: EventsByYear, date: Day) => ({
          ...acc,
          [date.year]: {
            ...acc[date.year],
            [date.date]: [
              ...(filteredEvents?.[date.year]?.[date.date] || []),
              { ...updateEventDto.updatedEvent, weekNumber: date.weekNumber },
            ],
          },
        }),
        {},
      );

      Object.keys(newDates).map((year) => {
        filteredEvents[year] = {
          ...filteredEvents[year],
          ...newDates[year],
        };
      });

      this.publicEventService.update(apartmentId, userId, filteredEvents);

      return this.eventModel
        .findOneAndUpdate(
          { userId, apartmentId },
          { data: filteredEvents },
          {
            upsert: true,
            new: true,
          },
        )
        .exec();
    }
  }

  findAllForUser(userId: string, apartmentId: string) {
    return this.eventModel.findOne({
      userId,
      apartmentId,
    });
  }

  async remove(
    apartmentId: string,
    userId: string,
    eventToRemove: RemoveEventDto,
  ) {
    const existingEvents = await this.eventModel
      .findOne({
        userId,
        apartmentId,
      })
      .exec();

    if (existingEvents) {
      const filteredEvents = Object.keys(existingEvents.data).reduce(
        (acc: EventsByYear, year: string) => {
          acc[year] = Object.keys(existingEvents.data[year]).reduce(
            (acc2: { [key: string]: EventObject[] }, date: string) => {
              acc2[date] = existingEvents.data[year][date].filter(
                (event: EventObject) => event.id !== eventToRemove.id,
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

      this.publicEventService.remove(apartmentId, userId, eventToRemove);

      return await this.eventModel.findOneAndUpdate(
        { userId, apartmentId },
        { data: filteredEvents },
        {
          upsert: true,
          new: true,
        },
      );
    }
  }

  async removeApartmentEvents(userId: string, apartmentId: string) {
    return await this.eventModel.findOneAndDelete({
      userId,
      apartmentId,
    });
  }
}
