import { IsEmail, IsNotEmpty } from "class-validator";

export class InscriptionDto {
    @IsNotEmpty()
    Nom: string
    @IsNotEmpty()
    Prenom: string
    @IsNotEmpty()
    NumTel: number
    @IsNotEmpty()
    Adresse: string
    @IsEmail()
    @IsNotEmpty()
    email: string
    @IsNotEmpty()
    MotDePasse: string
    @IsNotEmpty()
    Ville: string
    CodePostal: string
    PhotoProfil : string
    @IsNotEmpty()
    MotDePasseConfirmation: string;

}