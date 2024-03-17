import { TypeCarburant } from "@prisma/client"
import { IsArray, IsNotEmpty } from "class-validator"
//import { MediaDto } from "./mediaDto"

export class CreatePubDto {
    @IsNotEmpty()
    marque: string
    @IsNotEmpty()
    model: string
    @IsNotEmpty()
    anneeFabrication: number
    @IsNotEmpty()
    nombrePlace: number
    @IsNotEmpty()
    couleur: string
    @IsNotEmpty()
    kilometrage: number
    @IsNotEmpty()
    prix: number
    descrption: string
    @IsNotEmpty()
    typeCarburant: TypeCarburant
    //media: MediaDto[];
    //userId: number;
    //@IsArray()
    // images?: string[];
    //video?: string;
    @IsNotEmpty()
    @IsArray()
    images: Express.Multer.File[];
    // @IsNotEmpty()
    //@IsArray()
    //videos?: Express.Multer.File[];
}