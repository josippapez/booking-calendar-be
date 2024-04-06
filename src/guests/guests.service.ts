import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DateTime } from 'luxon';
import { Model } from 'mongoose';
import { CreateGuestDto } from 'src/guests/dto/create-gudest.dto';
import { GuestDocument, GuestObject, Guests } from '../schemas/guests.schema';
import { RemoveGuestDto } from './dto/remove-guest.dto';
import { UpdateGuestDto } from 'src/guests/dto/update-guest.dto';

@Injectable()
export class GuestsService {
  constructor(
    @InjectModel(Guests.name)
    private guestModel: Model<GuestDocument>,
  ) {}

  async create(
    createGuestDto: CreateGuestDto,
    userId: string,
    apartmentId: string,
  ) {
    const existingGuests = (await this.guestModel
      .findOne({
        userId,
        apartmentId,
      })
      .lean()) || { data: {}, apartmentId, userId };

    const startToAdd = DateTime.fromISO(createGuestDto.dateOfArrival);
    const endToAdd = DateTime.fromISO(createGuestDto.dateOfDeparture);
    const months = Math.ceil(
      endToAdd.diff(startToAdd, ['months', 'days']).months,
    );

    const guestObject = GuestObject.init({ ...createGuestDto });

    for (let i = 0; i <= months; i++) {
      const month = startToAdd.plus({ months: i });

      const existingMonth =
        existingGuests.data[month.year]?.[month.month] ?? [];

      existingGuests.data[month.year] = {
        ...existingGuests.data[month.year],
        [month.month]: [...existingMonth, guestObject],
      };
    }

    return this.guestModel
      .findOneAndUpdate(
        { userId, apartmentId },
        { data: existingGuests.data },
        {
          upsert: true,
          new: true,
        },
      )
      .lean();
  }

  findAll() {
    return `This action returns all guests`;
  }

  async findOne(apartmentId: string, userId: string, selectedYear: string) {
    const guests = await this.guestModel
      .findOne(
        { apartmentId, userId },
        {
          data: {
            [selectedYear]: 1,
          },
          userId: 1,
          apartmentId: 1,
        },
      )
      .lean();

    return guests;
  }

  async update(
    userId: string,
    apartmentId: string,
    updateGuestDto: UpdateGuestDto,
  ) {
    const currentGuestDto = updateGuestDto.oldGuestInfo;
    const newGuestDto = updateGuestDto.newGuestInfo;

    const existingGuests = await this.remove(userId, apartmentId, {
      guestId: currentGuestDto.id,
      startDate: currentGuestDto.dateOfArrival,
      endDate: currentGuestDto.dateOfDeparture,
    });

    if (existingGuests) {
      const startToAdd = DateTime.fromISO(newGuestDto.dateOfArrival);
      const endToAdd = DateTime.fromISO(newGuestDto.dateOfDeparture);
      const months = Math.ceil(
        endToAdd.diff(startToAdd, ['months', 'days']).months,
      );

      for (let i = 0; i <= months; i++) {
        const month = startToAdd.plus({ months: i });

        const existingMonth =
          existingGuests.data[month.year]?.[month.month] ?? [];

        existingGuests.data = {
          ...existingGuests.data,
          [month.year]: {
            ...existingGuests.data[month.year],
            [month.month]: [...existingMonth, newGuestDto],
          },
        };
      }

      return await this.guestModel.findOneAndUpdate(
        { userId, apartmentId },
        { data: existingGuests.data },
        { upsert: true, new: true },
      );
    }
  }

  async remove(
    userId: string,
    apartmentId: string,
    removeGuestDto: RemoveGuestDto,
  ) {
    const existingGuests = await this.guestModel
      .findOne({
        userId,
        apartmentId,
      })
      .lean();

    const guestId = removeGuestDto.guestId;

    if (removeGuestDto) {
      const startToRemove = DateTime.fromISO(removeGuestDto.startDate);
      const endToRemove = DateTime.fromISO(removeGuestDto.endDate);
      const months = Math.ceil(
        endToRemove.diff(startToRemove, ['months', 'days']).months,
      );

      for (let i = 0; i <= months; i++) {
        const month = startToRemove.plus({ months: i });

        const existingMonth =
          existingGuests.data[month.year]?.[month.month] ?? [];

        existingGuests.data[month.year] = {
          ...existingGuests.data[month.year],
          [month.month]: existingMonth.filter(
            (guest: GuestObject) => guest.id !== guestId,
          ),
        };

        if (existingGuests.data[month.year][month.month].length === 0) {
          delete existingGuests.data[month.year][month.month];
        }
        if (Object.keys(existingGuests.data[month.year]).length === 0) {
          delete existingGuests.data[month.year];
        }
      }
    }

    return await this.guestModel
      .findOneAndUpdate(
        { userId, apartmentId },
        { data: existingGuests.data },
        { upsert: true, new: true },
      )
      .lean();
  }
}
