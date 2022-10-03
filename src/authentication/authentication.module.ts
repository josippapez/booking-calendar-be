/* istanbul ignore file */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { JwtAccessTokenStrategy } from './jwt-access-token.strategy';
import { JwtRefreshTokenStrategy } from './jwt-refresh-token.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [UsersModule, PassportModule, ConfigModule, JwtModule.register({})],
  providers: [
    AuthenticationService,
    LocalStrategy,
    JwtRefreshTokenStrategy,
    JwtAccessTokenStrategy,
  ],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
