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
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { LoginResponse } from 'src/authentication/dto/LoginResponse';
import { ApiErrorResponse } from 'src/schemas/error';
import CreateUserDto from '../users/dto/create-user.dto';
import { AuthenticationService } from './authentication.service';
import GoogleAuthGuard from './google.guard';
import JwtRefreshGuard from './jwt-refresh.guard';
import { LocalAuthenticationGuard } from './localAuthentication.guard';
import RequestWithUser from './requestWithUser.interface';

@ApiTags('Authentication')
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res() response: Response,
  ) {
    const registeredUser =
      await this.authenticationService.create(createUserDto);
    const accessToken = this.authenticationService.getJwtAccessToken(
      registeredUser['_id'].valueOf(),
    );
    const refreshToken = this.authenticationService.getJwtRefreshToken(
      registeredUser['_id'].valueOf(),
    );
    return response.send({ user: registeredUser, accessToken, refreshToken });
  }

  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LoginResponse,
  })
  @ApiResponse({
    status: 401 | 400,
    description: 'Invalid email or password',
    type: ApiErrorResponse,
  })
  @UseGuards(LocalAuthenticationGuard)
  @HttpCode(200)
  @Post('login')
  async logIn(
    @Body() user: CreateUserDto,
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ) {
    const singleUser = await this.authenticationService.getAuthenticatedUser(
      user.email,
      user.password,
    );
    const accessToken = this.authenticationService.getJwtAccessToken(
      singleUser.id.valueOf(),
    );
    const refreshToken = this.authenticationService.getJwtRefreshToken(
      singleUser.id.valueOf(),
    );
    user.password = undefined;
    return response.send({ user, accessToken, refreshToken });
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  async googleAuth(@Req() req) {
    return;
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/redirect')
  async googleAuthRedirect(@Req() req, @Res({ passthrough: true }) res) {
    const user = await this.authenticationService.googleLogin(req);
    user.user.password = undefined;
    return res.redirect(
      `${process.env.CORS_ORIGIN}?accessToken=` +
        user.accessToken +
        '&refreshToken=' +
        user.refreshToken +
        '&user=' +
        JSON.stringify(user.user),
    );
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
