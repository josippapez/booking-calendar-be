import { Model } from 'mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findOrCreate(email: string) {
    const user = await this.userModel.findOne({ email });
    if (user) {
      return user;
    }
    const createdUser = new this.userModel({ email });
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async getById(id: string) {
    const user = await this.userModel.findById(id);
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    if (user) {
      return user;
    }
    throw new HttpException('auth.DOES_NOT_EXIST', HttpStatus.NOT_FOUND);
  }
}
