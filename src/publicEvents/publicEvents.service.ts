import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEventDto } from '../events/dto/create-event.dto';
import { Day, EventsByYear } from '../events/dto/EventType';
import { RemoveEventDto } from '../events/dto/remove-event.dto';
import { UpdateEventDto } from '../events/dto/update-event.dto';
import {
  PublicEvent,
  PublicEventDocument,
} from '../schemas/publicEvents.schema';

@Injectable()
export class PublicEventsService {
  constructor(
    @InjectModel(PublicEvent.name)
    private eventModel: Model<PublicEventDocument>,
  ) {}

  async addNew(
    dates: Day[],
    userid: string,
    apartmentid: string,
    createEventDto: CreateEventDto,
  ) {
    const existingPublicEvents = (await this.eventModel.findOne({
      userid,
      apartmentid,
    })) || { data: {}, apartmentid, userid };

    const publicEvents = dates.reduce(
      (acc: EventsByYear, date: Day) => ({
        ...acc,
        [date.year]: {
          ...acc[date.year],
          [date.date]: [
            ...((existingPublicEvents?.data[date.year] &&
              existingPublicEvents?.data[date.year][date.date]) ||
              []),
            {
              id: createEventDto.id,
              start: createEventDto.start,
              end: createEventDto.end,
            },
          ],
        },
      }),
      {},
    );

    Object.keys(publicEvents).map((year) => {
      existingPublicEvents.data[year] = {
        ...existingPublicEvents?.data[year],
        ...publicEvents[year],
      };
    });

    await this.eventModel.findOneAndUpdate(
      { userid, apartmentid },
      { data: existingPublicEvents.data },
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
    datesToEdit: Day[],
    dates: Day[],
  ) {
    const existingPublicEvents = await this.eventModel
      .findOne({
        userid,
        apartmentid,
      })
      .exec();

    if (
      existingPublicEvents &&
      existingPublicEvents.apartmentid &&
      existingPublicEvents.userid
    ) {
      datesToEdit.map((date) => {
        if (existingPublicEvents.data[date.year][date.date]) {
          existingPublicEvents.data[date.year] = {
            ...existingPublicEvents.data[date.year],
            [date.date]: [
              ...existingPublicEvents.data[date.year][date.date].filter(
                (event: { id: string }) =>
                  event.id !== updateEventDto.updatedEvent.id,
              ),
            ],
          };
          if (existingPublicEvents.data[date.year][date.date].length === 0) {
            delete existingPublicEvents.data[date.year][date.date];
          }
        } else if (
          Object.keys(existingPublicEvents.data[date.year]).length === 0
        ) {
          delete existingPublicEvents.data[date.year];
        }
      });

      const newDates = dates.reduce(
        (acc: EventsByYear, date: Day) => ({
          ...acc,
          [date.year]: {
            ...acc[date.year],
            [date.date]: [
              ...((existingPublicEvents?.data[date.year] &&
                existingPublicEvents?.data[date.year][date.date]) ||
                []),
              {
                id: updateEventDto.updatedEvent.id,
                start: updateEventDto.updatedEvent.start,
                end: updateEventDto.updatedEvent.end,
              },
            ],
          },
        }),
        {},
      );

      Object.keys(newDates).map((year) => {
        existingPublicEvents.data[year] = {
          ...existingPublicEvents?.data[year],
          ...newDates[year],
        };
      });

      return this.eventModel.findOneAndUpdate(
        { userid, apartmentid },
        { data: existingPublicEvents.data },
        {
          upsert: true,
          new: true,
        },
      );
    }
  }

  async findAllForApartment(apartmentid: string) {
    return await this.eventModel.findOne({ apartmentid });
  }

  async remove(
    apartmentid: string,
    userid: string,
    eventToRemove: RemoveEventDto,
    datesToRemove: Day[],
  ) {
    const existingEvents = await this.eventModel
      .findOne({
        userid,
        apartmentid,
      })
      .exec();

    if (existingEvents && existingEvents.apartmentid && existingEvents.userid) {
      datesToRemove.map((date) => {
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
        } else if (
          Object.keys(existingEvents.data.data[date.year]).length === 0
        ) {
          delete existingEvents.data[date.year];
        }
      });

      await this.eventModel.findOneAndUpdate(
        { userid, apartmentid },
        { data: existingEvents.data },
        {
          upsert: true,
          new: true,
        },
      );
    }
  }

  async removeApartmentEvents(userid: string, apartmentid: string) {
    return await this.eventModel.findOneAndRemove({
      userid,
      apartmentid,
    });
  }
}
