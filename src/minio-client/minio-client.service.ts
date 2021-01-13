import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { InjectS3 } from 'nestjs-s3';

@Injectable()
export class MinioClientService {
  constructor(
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
    let key = await new Date().getTime().toString();
    let params = { Bucket: data.Bucket, Key: key, Body: opject.buffer };
   return await this.uploud(params)
  }

  uploud(params) {
    let fileUrl = `localhost:3000/minio-client/download/${params.Bucket}/${params.Key}`
    return new Promise((resolve, reject) => {
      return this.s3.putObject(params, (err, eTag) => {
        if (err) {
          return reject(err);
        }
        return resolve({
          message: 'opject has been uploaded',
          fileUrl: fileUrl,
          success: true
        });
      }
      );
    });
  }

  downloadFile(bucket, id) {
    let params = { Bucket: bucket, Key: id };
    return new Promise((resolve, reject) => {
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

  async removeBucket(data) {
    return new Promise((resolve, reject) => {
      this.s3.deleteBucket(data, function (err) {
        if (err) {
          return reject(err)
        }
      })
      return resolve({
        message: `Bucket ${data.Bucket} removed successfully.`,
        success: true
      })
    })
  }

  makeBucket(data) {
    return new Promise((resolve, reject) => {
      return this.s3.createBucket(data, (err) => {
        if (err) {
          if ((err as any).code === "BucketAlreadyOwnedByYou") {
            return resolve({
              message: "Bucket " + data.Bucket + " already exists ",
              success: false
            });
          } else {
            return reject(err);
          }
        }
        return resolve({
          message:
            "Bucket " +
            data.Bucket +
            " created successfully in ",
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
      return resolve({//return even if bucket is not exists
        message: `Bucket  ${bucketName} is exists.`
      })
    })
  }

  listOpjects(Bucket){
    return new Promise((resolve,reject)=>{
      this.s3.listObjects(Bucket ,(err,data)=>{
        if(err){
          return resolve({
            message:'The specified bucket does not exist kindly enter a valid name',
          })
        }
        return resolve(data)
      })
    })
  }

}