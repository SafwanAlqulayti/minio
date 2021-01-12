import { BadRequestException, Injectable } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';

@Injectable()
export class MinioClientService {
  constructor(
    private readonly _minioService: MinioService
  ) { }
  public bucket = process.env.MINIO_BUCKET
  async getAllBuckets() {
    let allBuckets = await this._minioService.client.listBuckets();
    if(allBuckets !== null){
      return allBuckets
    }else{
      let msg = {message: "There is no bucket"}
      return msg
    }
  }

  async putOpject(opject,data) {
    let extension = data.extension
    let bucketName = data.bucketName
    let key = await new Date().getTime().toString() ;
    this._minioService.client.putObject(this.bucket, key , opject.buffer, opject.size, function (err) {
      if (err) {
        console.log('Error occured in uploading', err)
        throw BadRequestException
      }
    })
    let fileUrl = `localhost:3000/download/${bucketName}/${key}`
    return fileUrl
  }
  
//  async presignedUrl(fileName: string) {
//    let url = await this._minioService.client.
   
//    presignedUrl('GET', this.bucket, fileName, 24*60*60, function(err, presignedUrl) {
//       if (err) {return console.log(err)}
//       console.log(presignedUrl)
       
//     })
//   }

  removeOpject(fileName: string) {
    this._minioService.client.removeObject(this.bucket, fileName, function (err) {
      if (err) {
        return console.log('Unable to remove object', err)
      }
      console.log('the object Removed')
    })
  }

  makeBucket(bucketName:string){
    console.log(bucketName)
  this._minioService.client.makeBucket(bucketName, 'us-east-1', function(err) {
    if (err) {
       console.log('Error creating bucket.', err)
       throw BadRequestException
    }
   return console.log('Bucket created successfully in "us-east-1".')
  })
}
bucketExists(bucketName:string){
  this._minioService.client.bucketExists(bucketName, function(err, exists) {
    if (err) {
       console.log(err)
      throw BadRequestException
    }
    if (exists) {
      return console.log('Bucket exists.')
    }
  })
}
}

