import { VercelRequest, VercelResponse } from '@vercel/node';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import express from 'express';

const expressApp = express();
let nestApp: NestExpressApplication | null = null;

async function bootstrap(): Promise<NestExpressApplication> {
  if (nestApp) {
    return nestApp;
  }

  const { AppModule } = await import('../dist/app.module.js');
  
  const adapter = new ExpressAdapter(expressApp);
  nestApp = await NestFactory.create<NestExpressApplication>(AppModule, adapter, {
    logger: ['error', 'warn', 'log'],
  });

  nestApp.setGlobalPrefix('api');

  nestApp.enableCors({
    origin: true, // Allow all origins for debugging
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  nestApp.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await nestApp.init();
  return nestApp;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await bootstrap();
    expressApp(req as any, res as any);
  } catch (error) {
    console.error('Error in handler:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}
