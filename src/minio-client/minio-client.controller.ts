import { Body, Controller, Delete, Get, Param, Post, Res, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BucketDto } from './dto/bucketDto';
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
    @UsePipes(ValidationPipe)
    uploudFile(@UploadedFile() file, @Body() bucket:BucketDto) {
        return this._minioClientService.putOpject(file, bucket)
    }

    @Get('download/:bucket/:id')
    async downloadFile(@Param('Bucket') bucket, @Param('id') id, @Res() res) {
        return res.send(await this._minioClientService.downloadFile(bucket, id))
    }

    @Delete('remove-bucket')
    @UsePipes(ValidationPipe)
    removeBucket(@Body() bucket:BucketDto) {
        return this._minioClientService.removeBucket(bucket)
    }

    @Delete('remove-opject')
    removeOpject(@Body() data) {//{Bucket: , Key:}
        return this._minioClientService.removeOpject(data)
    }

    @Post('make-bucket')
    makeBucket(@Body() bucket) {
        return this._minioClientService.makeBucket(bucket)
    }

    @Post('bucket-exists')
    bucketExists(@Body() bucket) {
        return this._minioClientService.bucketExists(bucket)
    }

    @Post('list-opjects')
    listOpjects(@Body() bucket){
        return this._minioClientService.listOpjects(bucket)
    }
}