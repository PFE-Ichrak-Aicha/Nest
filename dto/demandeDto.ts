import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class DemandeDto {
    @IsNotEmpty()
    Nom: string
    @IsNotEmpty()
    Prenom: string
    @IsOptional()
    NumTel?: string
    Adresse: string
    @IsEmail()
    @IsNotEmpty()
    email: string
    Ville: string
    @IsNotEmpty()
    commentaire : string
    CodePostal: string
    PhotoProfil: string
   // @IsNotEmpty()
    //MotDePasseConfirmation: string;

}