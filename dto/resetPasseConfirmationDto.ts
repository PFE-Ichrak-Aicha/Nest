import { IsEmail, IsNotEmpty } from "class-validator";
export class ResetPasseConfirmationDto{
    @IsEmail()
    @IsNotEmpty()
    email: string
    @IsNotEmpty()
    MotDePasse: string
    @IsNotEmpty()
    code : string

}