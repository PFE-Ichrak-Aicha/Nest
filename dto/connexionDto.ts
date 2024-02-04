import { IsEmail, IsNotEmpty } from "class-validator";

export class connexionDto {
    @IsEmail()
    @IsNotEmpty()
    email: string
    @IsNotEmpty()
    MotDePasse: string
}