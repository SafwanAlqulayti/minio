import { BadRequestException, Injectable } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';

@Injectable()
export class MinioClientService {
  constructor( 
    private readonly _minioService: MinioService
     ) { }
     public bucket = process.env.MINIO_BUCKET
  async getAllBuckets() {
    return this._minioService.client.listBuckets();
  }

  async putOpject(opject) {
     this._minioService.client.putObject(this.bucket, opject.originalname , opject.buffer ,opject.size, function(err) {
     if (err) {
        console.log('Error occured in uploading', err)
          throw BadRequestException
    } else {
       console.log('The file has updluaded successfully')
     }
  })
  }

    getOpject(fileName:string){
    this._minioService.client.fGetObject(this.bucket, fileName, `./${fileName}`, function(err) {
      if (err) {
        return console.log(err)
      }
      console.log('success')
    })
  }

  removeOpject(fileName:string){
  this._minioService.client.removeObject(this.bucket, fileName, function(err) {
    if (err) {
      return console.log('Unable to remove object', err)
    }
    console.log('the object Removed')
   })
}
}
 
