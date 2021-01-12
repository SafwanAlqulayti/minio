import { Body, Controller, Delete, Get, Param, Post, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3 } from 'aws-sdk';
import { InjectS3 } from 'nestjs-s3';
import { MinioClientService } from './minio-client.service';

@Controller('minio-client')
export class MinioClientController {
    constructor(private _minioClientService: MinioClientService,
        @InjectS3() private readonly s3: S3,

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
    
    @Get('download/:bucket/:id')
    async downloadFile(@Param('bucket') bucket ,@Param('id') id ,@Res() res){
        try {
            var params = {Bucket: bucket, Key: id};
            this.s3.getObject(params, function (err, data) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.send(data.Body)
                }
            });
        }catch (e){
            console.log(e)
        }
        
      //return  res.send(await this._minioClientService.downloadFile(bucket,id))
    }
    @Get('e')
    getOpject(){
        return this._minioClientService.getOpject()
    }

    @Delete('remove-bucket')
    removeBucket(@Body('bucketName') bucketName){
        return this._minioClientService.removeBucket(bucketName)
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
