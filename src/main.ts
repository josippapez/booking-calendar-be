import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

const PORT = parseInt(process.env.PORT, 10) || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  });
  app.use(cookieParser());

  const swaggerConfig = {
    baseUrl: process.env.SWAGGER_BASE_URL || 'http://localhost:8001',
  };

  const config = new DocumentBuilder()
    .setTitle('Booking calendar API')
    .setDescription('Booking calendar API description')
    .setExternalDoc(
      `http://${swaggerConfig.baseUrl}/api-docs-json`,
      `http://${swaggerConfig.baseUrl}/api-docs-json`,
    )
    .addBearerAuth()
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(PORT);
}
bootstrap();
