import { IsEmail, IsNotEmpty, IsOptional } from "class-validator"

export class UpdateAccountDto {
    @IsNotEmpty()
    @IsOptional()
    Nom ?: string
    @IsNotEmpty()
    @IsOptional()
    Prenom ?: string
    @IsNotEmpty()
    @IsOptional()
    NumTel ?: number
    @IsNotEmpty()
    @IsOptional()
    Adresse ?: string
    @IsEmail()
    @IsOptional()
    @IsNotEmpty()
    email ?: string
    @IsNotEmpty()
    @IsOptional()
    MotDePasse ? : string
    @IsNotEmpty()
    @IsOptional()
    Ville ?: string
    @IsOptional()
    CodePostal ?: string
    @IsOptional()
    PhotoProfil ? : string

}