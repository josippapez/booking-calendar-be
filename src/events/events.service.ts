import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DateTime } from 'luxon';
import { Model } from 'mongoose';
import { Day } from 'src/events/dto/EventType';
import { EventsFiltersDto } from 'src/events/dto/events-filters.dto';
import { GuestsService } from 'src/guests/guests.service';
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
    @Inject(forwardRef(() => PublicEventsService))
    private readonly publicEventService: PublicEventsService,
    @Inject(forwardRef(() => GuestsService))
    private readonly guestsService: GuestsService,
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

    const guest = await this.guestsService.create(
      {
        address: '',
        city: '',
        country: '',
        dateOfArrival: createEventDto.start,
        dateOfDeparture: createEventDto.end,
        dateOfBirth: '',
        name: createEventDto.title,
        numberOfInvoice: 0,
        travelIdNumber: '',
        note: '',
        PID: '',
      },
      userId,
      apartmentId,
    );

    const eventObject = EventObject.init({
      ...createEventDto,
      guestId: guest.id,
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
      .lean();
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
      const oldGuestInfo = await this.guestsService.findOne(
        apartmentId,
        userId,
        new Date(updateEventDto.oldEvent.end).getFullYear().toString(),
        updateEventDto.oldEvent.guestId,
      );
      this.guestsService.update(userId, apartmentId, {
        oldGuestInfo: {
          ...oldGuestInfo,
        },
        newGuestInfo: {
          ...oldGuestInfo,
          dateOfArrival: updateEventDto.updatedEvent.start,
          dateOfDeparture: updateEventDto.updatedEvent.end,
        },
      });

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

  async findAllForUser(
    userId: string,
    apartmentId: string,
    filter: EventsFiltersDto,
  ) {
    let dataFilter = {
      [filter.year]: 1,
    };

    if (filter.month === '12') {
      dataFilter = {
        [filter.year]: 1,
        [Number(filter.year) + 1]: 1,
      };
    }

    if (filter.month === '1') {
      dataFilter = {
        [filter.year]: 1,
        [Number(filter.year) - 1]: 1,
      };
    }

    const events = await this.eventModel.findOne(
      {
        userId,
        apartmentId,
      },
      {
        userId: 1,
        apartmentId: 1,
        data: dataFilter,
      },
      {
        lean: true,
      },
    );
    return Events.mapObjectToEventObject(events, filter.month);
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
      this.guestsService.remove(userId, apartmentId, {
        guestId: eventToRemove.guestId,
        startDate: eventToRemove.start,
        endDate: eventToRemove.end,
      });

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
