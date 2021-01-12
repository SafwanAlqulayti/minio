import { BadRequestException, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { MinioService } from 'nestjs-minio-client';
import { InjectS3 } from 'nestjs-s3';

@Injectable()
export class MinioClientService {
  constructor(
    private readonly _minioService: MinioService,
    @InjectS3() private readonly s3: S3,
  ) { }
  public bucket = process.env.MINIO_BUCKET

  async getAllBuckets() {
    return await new Promise((resolve, reject) => {
      this.s3.listBuckets(function (err, buckets) {
        if (err) {
          return reject(err)
        }
        return resolve(buckets)
      })
    })
  }

  async putOpject(opject, data) {
    let bucketName = data.bucketName;
    let key = await new Date().getTime().toString();
    let params = { Bucket: bucketName, Key: key, Body: opject.buffer };
    this.s3.putObject(params, function (err) {
      if (err) {
        console.log('Error occured in uploading', err)
        throw BadRequestException
      }
    })
    let fileUrl = `localhost:3000/minio-client/download/${bucketName}/${key}`
    return fileUrl
  }

  async downloadFile(bucket, id) {
    let params = { Bucket: bucket, Key: id };
    return await new Promise((resolve, reject) => {
      this.s3.getObject(params, function (err, dataStream) {
        if (err) {
          return reject(err)
        }
        return resolve(dataStream.Body)
      })
    })
  }

  removeOpject(data) {
    this.s3.deleteObject(data, function (err) {
      if (err) {
        console.log('Unable to remove object', err)
      }
      console.log('the object Removed')
    })
  }

  removeBucket(bucketName) {
    this.s3.deleteBucket(bucketName, function (err) {
      if (err) return console.log('unable to remove bucket.')
    })
    let msg = { message: 'Bucket removed successfully.' }
    return msg
  }

  async makeBucket(bucketName) {
    this.s3.createBucket(bucketName, function (err) {
      if (err) {
        console.log('Error creating bucket.', err)
        throw BadRequestException
      }
    })
    let msg = { message: "the bucket has been created" }
    return msg
  }

  bucketExists(bucketName: string) {
    this._minioService.client.bucketExists(bucketName, function (err, exists) {
      if (err) {
        console.log(err)
        throw new BadRequestException
      }
    })
    let msg = { message: 'Bucket exists.' }
    return msg

  }
  // async getOpject(){
  //   this._minioService.client.presignedGetObject(this.bucket, '1610466628887', 24*60*60, function(err, presignedUrl) {
  //     if (err) return console.log(err)
  //     console.log(presignedUrl)
  //   })
  // }
  //  async getFile(params){

  //     return await this.s3.getObject(params, function (err, data) {
  //       if (err) {
  //        console.log(err)
  //       }
  //       return  JSON.stringify( data.Body)
  //     })

  //   }
}


//   let params = {Bucket: bucket, Key: id};
//  let file =  this.s3.getObject(params,  function (err, data) {
//       if (err) {
//           console.log("-----", data.Body);
//           throw BadRequestException
//       } 
//           console.log("-----", data.Body);
//           return data.Body
//     })     

// async downloadFile(bucket ,id){

//   let params = {Bucket: bucket, Key: id};
//  let file =  this.s3.getObject(params,  function (err, data) {
//       if (err) {
//           console.log("-----", data.Body);
//           throw BadRequestException
//       } 
//           console.log("-----", data.Body);
//           return data.Body
//     })        


//  async presignedUrl(fileName: string) {
//    let url = await this._minioService.client.

//    presignedUrl('GET', this.bucket, fileName, 24*60*60, function(err, presignedUrl) {
//       if (err) {return console.log(err)}
//       console.log(presignedUrl)

//     })
//   }


// async downloadFile(bucket ,id){

//   var params = {Bucket: bucket, Key: id};
//  let file =  this.s3.getObject(params,  function (err, data) {
//       if (err) {
//           console.log("-----", data.Body);
//           throw BadRequestException
//       } 
//           console.log("-----", data.Body);
//           return data.Body
//          // res.send(data.Body)

//   });
//   console.log(file,"file")
//   return  file
// let file 
// var params = {Bucket: bucket, Key: id};
// await this.s3.getObject(params, function(err, data) {
//   if (err) {
//     return console.log(err)
//   }
//   // dataStream.on('data', function(chunk) {
//   //   size += chunk.length
//   // })
//   // dataStream.on('end', function() {
//   //   console.log('End. Total size = ' + size)
//   // })
//   // dataStream.on('error', function(err) {
//   //   console.log(err)
//   // })
//   file = data.Body
// })
// return file


    // this._minioService.client.putObject(bucketName, key, opject.buffer, opject.size, function (err) {
    //   if (err) {
    //     console.log('Error occured in uploading', err)
    //     throw BadRequestException
    //   }Bucket
    // })

