import { Body, Controller, Delete, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
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
    uploudFile(@UploadedFile() file, @Body('Bucket') bucketName:string) {
        return this._minioClientService.putOpject(file, bucketName)
    }

    @Get('download/:bucket/:id')
    async downloadFile(@Param('bucket') bucket, @Param('id') id, @Res() res) {
        return res.send(await this._minioClientService.downloadFile(bucket, id))
    }

    @Delete('remove-bucket')
    removeBucket(@Body() bucketName) {
        return this._minioClientService.removeBucket(bucketName)
    }

    @Delete('remove-opject')
    removeOpject(@Body() data) {//{Bucket: , Key:}
        return this._minioClientService.removeOpject(data)
    }

    @Post('make-bucket')
    makeBucket(@Body() bucketName: string) {
        return this._minioClientService.makeBucket(bucketName)
    }

    @Post('bucket-exists')
    bucketExists(@Body() bucketName) {
        return this._minioClientService.bucketExists(bucketName)
    }
}

    // @Get('e')
    // getOpject(){
    //     return this._minioClientService.getOpject()
    // }

        // try {
        //     var params = {Bucket: bucket, Key: id};
        //     this.s3.getObject(params, function (err, data) {
        //         if (err) {
        //             res.status(500).send(err);
        //         } else {
        //             res.send(data.Body)
        //         }
        //     });
        // }catch (e){
        //     console.log(e)
        // }
