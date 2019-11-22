import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as path from 'path';
import * as fs from 'fs-sync';
import { AppService } from './app.service';
import { TelegramService } from './telegram/telegram.service';

async function bootstrap() {
  const filePath = `${__dirname}/../.env.json`;
  AppService.configurationFile = fs.readJSON(filePath);

  const app = await NestFactory.create(AppModule);
  app.use(express.static(path.join(__dirname, 'assets')));

  await TelegramService.startTheTelegramBot();
  await app.listen(AppService.configurationFile.port);
}
bootstrap();
