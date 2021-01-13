import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

  async putOpject(opject, bucketName) {
    let key = await new Date().getTime().toString();
    let params = { Bucket: bucketName, Key: key, Body: opject.buffer };
    await this.uploud(params)
    let fileUrl = `localhost:3000/minio-client/download/${bucketName}/${key}`
    return fileUrl
  }

  uploud(params) {
    return new Promise((resolve, reject) => {
      return this.s3.putObject(params, (err, eTag) => {
        if (err) {
          let msg = { message: "The specified bucket does not exist kindly enter a valid name" }
          return reject(err);
        }
        return resolve({
          message: 'opject has been uploaded',
          success: true
        });
      }
      );
    });
  }

 downloadFile(bucket, id) {
    let params = { Bucket: bucket, Key: id };
    return  new Promise((resolve, reject) => {
      this.s3.getObject(params, function (err, dataStream) {
        if (err) {
          return reject(err)
        }
        return resolve(dataStream.Body)
      })
    })
  }

   removeOpject(data) {
    return new Promise((resolve, reject) => {
      this.s3.deleteObject(data, function (err) {
        if (err) {
          console.log('Unable to remove object', err)
          return reject(err)
        }
        return resolve({
          message:
            "Bucket " +
            data.Bucket +
            " removed successfully ", success: true
        });
      })
    })
  }

  async removeBucket(bucketName) {
    return new Promise((resolve, reject) => {
      this.s3.deleteBucket(bucketName, function (err) {
        if (err) {
          return reject(err)
        }
      })
      return resolve({
        message: `Bucket ${bucketName} removed successfully.`,
        success: true
      })
    })
  }

   makeBucket(bucket) {
    return new Promise((resolve, reject) => {
      return this.s3.createBucket(bucket, (err) => {
        if (err) {
          if ((err as any).code === "BucketAlreadyOwnedByYou") {
            return resolve({
              message: "Bucket " + bucket.Bucket + " already exists ",
              success: false
            });
          } else {
            return reject(err);
          }
        }
        return resolve({
          message:
            "Bucket " +
            bucket +
            " created successfully in " ,
          success: true
        });
      });
    });
  }

  bucketExists(bucketName) {
    return new Promise((resolve, reject) => {
    this.s3.getBucketLocation(bucketName, function (err, exists) {
      if (err) {
      return reject(err)  
          }
    })
    return resolve({
      message:`Bucket  ${bucketName} is exists.` 
    })
  })
  }




//   return await new Promise((resolve, reject) => {
//     this.s3.createBucket(bucketName, function (err) {
//       if (err) {
//         console.log('Error creating bucket.', err)
//         reject(err)
//       }
//       return resolve({
//        message: "the bucket has been created" ,
//        success:true
//     })

//   })
// })
  // this.s3.putObject(params, function (err) {
  //   if (err) {
  //     console.log('Error occured in uploading', err)
  //     throw NotFoundException
  //   }
  // })

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

