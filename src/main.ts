import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppConfigService } from '@common/config/app-config.service';
import { GlobalExceptionFilter } from '@common/filters/global-exception.filter';

/**
 * HTTP bootstrap with validation, swagger, and global exception contract.
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const config = app.get(AppConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: false },
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());
  const doc = new DocumentBuilder()
    .setTitle('Promo code API')
    .setVersion('0.0.1')
    .addTag('promo-codes')
    .build();
  const document = SwaggerModule.createDocument(app, doc);
  SwaggerModule.setup('api/docs', app, document);
  await app.listen(config.port);
}
void bootstrap().catch((e) => {
  const logger = new Logger('bootstrap');
  if (e instanceof Error) {
    logger.error(e.message, e.stack);
  } else {
    logger.error(String(e));
  }
  process.exit(1);
});
