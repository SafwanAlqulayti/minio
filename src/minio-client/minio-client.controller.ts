import { Body, Controller, Delete, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioClientService } from './minio-client.service';

@Controller('minio-client')
export class MinioClientController {
    constructor(private _minioClientService: MinioClientService
                ) { }
    @Get('get-all-buckets')
    getAllBucket() {
        return this._minioClientService.getAllBuckets()
    }

    @Post('upload-opject')
    @UseInterceptors(FileInterceptor('file'))
    uploudFile(@UploadedFile() file ,@Body() data) {
        console.log(file)
        console.log(data)
        return this._minioClientService.putOpject(file ,data)
    }

    @Delete('remove-opject')
    removeOpject(@Body('fileName') fileName:string){
        return this._minioClientService.removeOpject(fileName)
    }

    @Post('make-bucket')
    makeBucket(@Body('bucketName') bucketName:string){
        return this._minioClientService.makeBucket(bucketName)
    }

    @Post('bucket-exists')
    bucketExists(@Body('bucketName') bucketName:string){
        return this._minioClientService.bucketExists(bucketName)
    }
}
