import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as sourceMapSupport from 'source-map-support';  


async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  sourceMapSupport.install(); 
  await app.listen(3000);
}
bootstrap();
