import { hash, compare } from 'bcryptjs';
import { z } from 'zod';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '../schemas/user.schema';
import CreateUserDto from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import TokenPayload from './tokenPayload.interface';

export const userSchema = z.object({
  email: z.string().email({ message: 'auth.EMAIL_NOT_VALID' }),
  password: z.string().min(6, { message: 'auth.PASSWORD_TOO_SHORT' }),
});

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      userSchema.parse(createUserDto);
      const hashedPassword = await hash(createUserDto.password, 10);
      const createdUser = await this.usersService.create({
        ...createUserDto,
        password: hashedPassword,
      });
      createdUser.password = undefined;
      return createdUser;
    } catch (error: z.ZodError | HttpException | any) {
      if (error instanceof z.ZodError) {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'auth.USER_ALREADY_EXISTS',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public getJwtAccessToken(userId: string) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
    return token;
  }

  public getJwtRefreshToken(userId: string) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
    return token;
  }

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.usersService.getByEmail(email);
      await this.verifyPassword(plainTextPassword, user.password);
      return user;
    } catch (error: HttpException | any) {
      if (error instanceof HttpException) {
        throw error;
      }
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await compare(plainTextPassword, hashedPassword);
    if (!isPasswordMatching) {
      throw new HttpException('auth.WRONG_CREDENTIALS', HttpStatus.BAD_REQUEST);
    }
  }

  public async googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }

    return {
      message: 'User information from google',
      user: req.user,
      accessToken: this.getJwtAccessToken(req.user._id),
      refreshToken: this.getJwtRefreshToken(req.user._id),
    };
  }
}
