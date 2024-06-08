const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./app.module');
const { ValidationPipe } = require('@nestjs/common');
const express = require('express');
const { join } = require('path');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({

    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });

  app.use('/uploads/profileimages', express.static(join(__dirname, '..', 'uploads', 'profileimages')));
  app.use('/uploads/certif', express.static(join(__dirname, '..', 'uploads', 'certif')));
  await app.listen(3000);
}

bootstrap();