import { Logger } from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";

import { MainApiModule } from "./modules/app/main-api.module";
import { ExceptionHandlerInterceptor, TransformResponseInterceptor } from "@app/utils/interceptors";
import { ThrowFirstErrorValidationPipe } from "@app/utils/pipes";

async function bootstrap() {
  const app = await NestFactory.create(MainApiModule, { cors: true });
  const globalPrefix = "api";
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalInterceptors(new TransformResponseInterceptor(new Reflector()));
  app.useGlobalInterceptors(new ExceptionHandlerInterceptor());
  app.useGlobalPipes(ThrowFirstErrorValidationPipe);
  const port = process.env.PORT || 80;
  await app.listen(port);
  Logger.log(`🚀 Main application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
