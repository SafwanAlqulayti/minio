import { Body, Controller, Delete, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioClientService } from './minio-client.service';

@Controller('minio-client')
export class MinioClientController {
    constructor(private _minioClientService: MinioClientService) { }
    @Get('get-all-buckets')
    getAllBucket() {
        return this._minioClientService.getAllBuckets()
    }

    @Post('upload-opject')
    @UseInterceptors(FileInterceptor('file'))
    uploudFile(@UploadedFile() file) {
        return this._minioClientService.putOpject(file)
    }

    @Post('one-opject')
    getOpject(@Body('fileName') fileName:string){
        return this._minioClientService.getOpject(fileName)
    }

    @Delete('remove-opject')
    removeOpject(@Body('fileName') fileName:string){
        return this._minioClientService.removeOpject(fileName)
    }
}
