import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MinioClientModule } from './minio-client/minio-client.module';

@Module({
  imports: [MinioClientModule,
    ConfigModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
