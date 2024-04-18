
import { FileInterceptor } from '@nestjs/platform-express';
import { Type } from 'class-transformer';
import { IsDefined, IsEmail, IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { diskStorage } from 'multer';
import { City } from '@prisma/client';
import { UploadedFile } from '@nestjs/common';
import { Multer } from 'multer';
export class FormExpertDto {

    @IsNotEmpty()
    @IsString()
    firstName: string;


    @IsNotEmpty()
    @IsString()
    lastName: string;


    @IsNotEmpty()
    @IsEmail()
    email: string;


    @IsNotEmpty()
    @IsString()
    tel: string;


    @IsNotEmpty()
    city: City;

    //@IsNotEmpty()
   // @IsString()
   // passe: string;


    @IsNotEmpty()
    //cv : any
    //@UploadedFile()
    //@Type(() => FileInterceptor('cv'))
    //@ValidateNested()
   cv: Express.Multer.File;
}