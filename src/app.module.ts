import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ApartmentsModule } from './apartments/apartments.module';
import { AuthenticationModule } from './authentication/authentication.module';
import mongodbConfig from './config/mongodb.config';
import { EventsModule } from './events/events.module';
import { PublicEventsModule } from './publicEvents/publicEvents.module';
import { UsersModule } from './users/users.module';
import { GuestsModule } from './guests/guests.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [mongodbConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        // useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        uri: configService.get<string>('mongodb.uri'),
      }),
      inject: [ConfigService],
    }),
    AuthenticationModule,
    UsersModule,
    ApartmentsModule,
    EventsModule,
    PublicEventsModule,
    GuestsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
