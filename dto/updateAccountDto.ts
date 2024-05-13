import { City } from "@prisma/client"
import { IsEmail, IsNotEmpty, IsOptional } from "class-validator"

export class UpdateAccountDto {
    @IsNotEmpty()
    @IsOptional()
    Nom?: string
    @IsNotEmpty()
    @IsOptional()
    Prenom?: string
    @IsNotEmpty()
    @IsOptional()
    NumTel?: string
    @IsNotEmpty()
    @IsOptional()
    Adresse?: string
    @IsEmail()
    @IsOptional()
    @IsNotEmpty()
    email?: string
    @IsNotEmpty()
    @IsOptional()
    MotDePasse?: string
    @IsNotEmpty()
    @IsOptional()
    Ville?: string
    @IsOptional()
    CodePostal?: string
    @IsOptional()
    PhotoProfil?: string
  
    @IsOptional()
    firstName: string;
    @IsOptional()
    lastName: string;
    @IsOptional()
    cv: string;
    @IsOptional()
    city: City;
    @IsOptional()
    passe: string;
    @IsOptional()
    tel: string 
    @IsOptional()
    description: string;

    @IsOptional()
    cout: string;
  
}