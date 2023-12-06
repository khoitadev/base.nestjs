import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '~/app.module';
import { AllExceptionsFilter } from '~/exception/all.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT: number | string = process.env.PORT || 3000;
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));
  await app.listen(PORT);
  console.log('Nestjs listening port: ', PORT);
}
bootstrap();
