import { Module } from '@nestjs/common';
import { MinioClientService } from './minio-client.service';
import { MinioClientController } from './minio-client.controller';
import { ConfigModule } from '@nestjs/config';
import { MinioModule } from 'nestjs-minio-client';
import { S3Module } from 'nestjs-s3';

@Module({
  imports:[ConfigModule.forRoot(),
    MinioModule.register({
    endPoint: process.env.MINIO_ENDPOINT,
    port: parseInt(process.env.MINIO_PORT),
    useSSL: true,
    accessKey: process.env.MINIO_ACCESSKEY,
    secretKey: process.env.MINIO_SECRETKEY
  }),
  S3Module.forRoot({
    config: {
      accessKeyId: process.env.MINIO_ACCESSKEY,
      secretAccessKey: process.env.MINIO_SECRETKEY,
      endpoint: process.env.MINIO_ENDPOINT,
      s3ForcePathStyle: true,
      signatureVersion: 'v4',
    },
  }),
],
  providers: [MinioClientService],
  controllers: [MinioClientController]
})
export class MinioClientModule {}
