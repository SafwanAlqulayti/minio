import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class BucketDto{
    @IsNotEmpty()
    @IsString()
    Bucket:string;

    @IsOptional()
    @IsString()
    Key?:string;
}