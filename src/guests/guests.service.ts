import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Guest, GuestDocument } from '../schemas/guests.schema';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { v4 as uuidv4 } from 'uuid';
import { DateTime } from 'luxon';
import { RemoveGuestDto } from './dto/remove-guest.dto';

@Injectable()
export class GuestsService {
  constructor(
    @InjectModel(Guest.name)
    private guestModel: Model<GuestDocument>,
  ) {}

  async createOrUpdate(
    createGuestDto: CreateGuestDto,
    userid: string,
    apartmentid: string,
  ) {
    const existingGuests = (await this.guestModel.findOne({
      userid,
      apartmentid,
    })) || { data: {}, apartmentid, userid };

    const UID = createGuestDto.oldGuestInfo?.id ?? uuidv4();

    if (createGuestDto.oldGuestInfo) {
      const startToRemove = DateTime.fromISO(
        createGuestDto.oldGuestInfo.dateOfArrival,
      );
      const endToRemove = DateTime.fromISO(
        createGuestDto.oldGuestInfo.dateOfDeparture,
      );
      const months = Math.ceil(
        endToRemove.diff(startToRemove, 'months').months,
      );

      for (let i = 0; i <= months; i++) {
        const month = startToRemove.plus({ months: i });
        existingGuests.data = {
          ...existingGuests.data,
          [month.year]: {
            ...existingGuests.data[month.year],
            [month.month]: {
              ...Object.entries(existingGuests.data[month.year][month.month])
                .filter(([key, value]) => key !== UID)
                .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
            },
          },
        };
        if (
          Object.keys(existingGuests.data[month.year][month.month]).length === 0
        ) {
          delete existingGuests.data[month.year][month.month];
        }
      }
    }

    const startToAdd = DateTime.fromISO(
      createGuestDto.newGuestInfo.dateOfArrival,
    );
    const endToAdd = DateTime.fromISO(
      createGuestDto.newGuestInfo.dateOfDeparture,
    );
    const months = Math.ceil(endToAdd.diff(startToAdd, 'months').months);

    for (let i = 0; i <= months; i++) {
      const month = startToAdd.plus({ months: i });

      existingGuests.data = {
        ...existingGuests.data,
        [month.year]: {
          ...existingGuests.data[month.year],
          [month.month]: {
            ...existingGuests.data[month.month],
            [UID]: createGuestDto.newGuestInfo,
          },
        },
      };
    }

    return await this.guestModel.findOneAndUpdate(
      { userid, apartmentid },
      { data: existingGuests.data },
      { upsert: true, new: true },
    );
  }

  findAll() {
    return `This action returns all guests`;
  }

  async findOne(apartmentid: string, userid: string, selectedyear: string) {
    const guests = await this.guestModel
      .findOne({ apartmentid, userid })
      .select(`data.${selectedyear}`);
    return guests;
  }

  update(id: number, updateGuestDto: UpdateGuestDto) {
    return `This action updates a #${id} guest`;
  }

  async remove(
    userid: string,
    apartmentid: string,
    removeGuestDto: RemoveGuestDto,
  ) {
    const existingGuests = (await this.guestModel.findOne({
      userid,
      apartmentid,
    })) || { data: {}, apartmentid, userid };

    const UID = removeGuestDto?.id ?? uuidv4();

    if (removeGuestDto) {
      const startToRemove = DateTime.fromISO(removeGuestDto.dateOfArrival);
      const endToRemove = DateTime.fromISO(removeGuestDto.dateOfDeparture);
      const months = Math.ceil(
        endToRemove.diff(startToRemove, 'months').months,
      );

      for (let i = 0; i <= months; i++) {
        const month = startToRemove.plus({ months: i });
        existingGuests.data = {
          ...existingGuests.data,
          [month.year]: {
            ...existingGuests.data[month.year],
            [month.month]: {
              ...Object.entries(existingGuests.data[month.year][month.month])
                .filter(([key, value]) => key !== UID)
                .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
            },
          },
        };
        if (
          Object.keys(existingGuests.data[month.year][month.month]).length === 0
        ) {
          delete existingGuests.data[month.year][month.month];
        }
      }
    }

    return await this.guestModel.findOneAndUpdate(
      { userid, apartmentid },
      { data: existingGuests.data },
      { upsert: true, new: true },
    );
  }
}
