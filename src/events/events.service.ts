import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DateTime } from 'luxon';
import { Model } from 'mongoose';
import { PublicEventsService } from '../publicEvents/publicEvents.service';
import { Event, EventDocument } from '../schemas/events.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { Day, EventsByYear } from './dto/EventType';
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
    @InjectModel(Event.name)
    private eventModel: Model<EventDocument>,
    private readonly publicEventService: PublicEventsService,
  ) {}

  async addNew(
    createEventDto: CreateEventDto,
    userid: string,
    apartmentid: string,
  ) {
    const existingEvents = (await this.eventModel.findOne({
      userid,
      apartmentid,
    })) || { data: {}, apartmentid, userid };

    const dates = eachDayOfRange(createEventDto.start, createEventDto.end);

    this.publicEventService.addNew(dates, userid, apartmentid, createEventDto);

    const newDates = dates.reduce(
      (acc: EventsByYear, date: Day) => ({
        ...acc,
        [date.year]: {
          ...acc[date.year],
          [date.date]: [
            ...((existingEvents?.data[date.year] &&
              existingEvents?.data[date.year][date.date]) ||
              []),
            { ...createEventDto, weekNumber: date.weekNumber },
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

    return this.eventModel.findOneAndUpdate(
      { userid, apartmentid },
      { data: existingEvents.data },
      {
        upsert: true,
        new: true,
      },
    );
  }

  async update(
    apartmentid: string,
    updateEventDto: UpdateEventDto,
    userid: string,
  ) {
    const existingEvents = await this.eventModel
      .findOne({
        userid,
        apartmentid,
      })
      .exec();

    if (existingEvents && existingEvents.apartmentid && existingEvents.userid) {
      const datesToEdit = eachDayOfRange(
        updateEventDto.oldEvent.start,
        updateEventDto.oldEvent.end,
      );

      datesToEdit.map((date) => {
        if (existingEvents.data[date.year][date.date]) {
          existingEvents.data[date.year] = {
            ...existingEvents.data[date.year],
            [date.date]: [
              ...existingEvents.data[date.year][date.date].filter(
                (event: { id: string }) =>
                  event.id !== updateEventDto.updatedEvent.id,
              ),
            ],
          };
          if (existingEvents.data[date.year][date.date].length === 0) {
            delete existingEvents.data[date.year][date.date];
          }
        } else if (Object.keys(existingEvents.data[date.year]).length === 0) {
          delete existingEvents.data[date.year];
        }
      });

      const dates = eachDayOfRange(
        updateEventDto.updatedEvent.start,
        updateEventDto.updatedEvent.end,
      );

      this.publicEventService.update(
        apartmentid,
        updateEventDto,
        userid,
        datesToEdit,
        dates,
      );

      const newDates = dates.reduce(
        (acc: EventsByYear, date: Day) => ({
          ...acc,
          [date.year]: {
            ...acc[date.year],
            [date.date]: [
              ...((existingEvents?.data[date.year] &&
                existingEvents?.data[date.year][date.date]) ||
                []),
              { ...updateEventDto.updatedEvent, weekNumber: date.weekNumber },
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

      return this.eventModel.findOneAndUpdate(
        { userid, apartmentid },
        { data: existingEvents.data },
        {
          upsert: true,
          new: true,
        },
      );
    }
  }

  findAllForUser(id: number, apartmentid: string) {
    return this.eventModel.findOne({ userid: id, apartmentid });
  }

  async remove(
    apartmentid: string,
    userid: string,
    eventToRemove: RemoveEventDto,
  ) {
    const existingEvents = await this.eventModel
      .findOne({
        userid,
        apartmentid,
      })
      .exec();

    if (existingEvents && existingEvents.apartmentid && existingEvents.userid) {
      const datesToEdit = eachDayOfRange(
        eventToRemove.start,
        eventToRemove.end,
      );
      datesToEdit.map((date) => {
        if (existingEvents.data[date.year][date.date]) {
          existingEvents.data[date.year] = {
            ...existingEvents.data[date.year],
            [date.date]: [
              ...existingEvents.data[date.year][date.date].filter(
                (event: { id: string }) => event.id !== eventToRemove.id,
              ),
            ],
          };
          if (existingEvents.data[date.year][date.date].length === 0) {
            delete existingEvents.data[date.year][date.date];
          }
        } else if (Object.keys(existingEvents.data[date.year]).length === 0) {
          delete existingEvents.data[date.year];
        }
      });

      this.publicEventService.remove(
        apartmentid,
        userid,
        eventToRemove,
        datesToEdit,
      );

      return await this.eventModel.findOneAndUpdate(
        { userid, apartmentid },
        { data: existingEvents.data },
        {
          upsert: true,
          new: true,
        },
      );
    }
  }
}
