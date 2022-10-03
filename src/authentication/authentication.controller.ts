import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import CreateUserDto from '../users/dto/create-user.dto';
import { AuthenticationService } from './authentication.service';
import GoogleAuthGuard from './google.guard';
import JwtRefreshGuard from './jwt-refresh.guard';
import { LocalAuthenticationGuard } from './localAuthentication.guard';
import RequestWithUser from './requestWithUser.interface';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res() response: Response,
  ) {
    const registeredUser = await this.authenticationService.create(
      createUserDto,
    );
    const accessToken = this.authenticationService.getJwtAccessToken(
      registeredUser['_id'].valueOf(),
    );
    const refreshToken = this.authenticationService.getJwtRefreshToken(
      registeredUser['_id'].valueOf(),
    );
    return response.send({ user: registeredUser, accessToken, refreshToken });
  }

  @UseGuards(LocalAuthenticationGuard)
  @HttpCode(200)
  @Post('login')
  async logIn(@Req() request: RequestWithUser, @Res() response: Response) {
    const { user } = request;
    const accessToken = this.authenticationService.getJwtAccessToken(
      user['_id'].valueOf(),
    );
    const refreshToken = this.authenticationService.getJwtRefreshToken(
      user['_id'].valueOf(),
    );
    user.password = undefined;
    return response.send({ user, accessToken, refreshToken });
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req) {
    return;
  }

  @Get('redirect')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Req() req) {
    return this.authenticationService.googleLogin(req);
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    const accessToken = this.authenticationService.getJwtAccessToken(
      request.user['_id'].valueOf(),
    );
    return accessToken;
  }
}
